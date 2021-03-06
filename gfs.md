GFS 阅读笔记

# Introduction

GFS 相比以前的分布式文件系统的如下不同：
  - component failures are the norm rather than the exception.
  - files are huge by traditional standards. Multi-GB files are common.
  - most files are mutated by appending new data rather than overwriting existing data.
  - co-designing the applications and the file system
API benefits the overall system by increasing our flexibility.

# Design Overview

## Assumptions
  - 系统依赖的机器经常会挂掉，所以需要具备自恢复能力。
    The system is built from many inexpensive commodity components that often fail. It must constantly monitor itself and detect, tolerate, and recover promptly from component failures on a routine basis.

  - 系统存储适量大文件，通常情况下100M甚至几个GB。需要支持小文件，但是不会为小文件做特别优化
    The system stores a modest number of large files. We expect a few million files, each typically 100 MB or larger in size. Multi-GB files are the common case and should be managed efficiently. Small files must be supported, but we need not optimize for them.

  - workloads主要是large streaming reads和small random reads。large streaming reads 每次读取1MB甚至更多，连续读取文件region。random reads随机读取offset，每次读取KB。

  - workloads也包括large，sequential writes。small random writes也支持，但是不需要特别优化。

  - 文件系统必须高效的支持多重写入。
  The system must efficiently implement well-defined semantics for multiple clients that concurrently append to the same file.

  - High sustained bandwidth is more important than low latency.


## Interface
  - create, delete, open, close, read, write
  - snapshot, record append


## Architecture

<img src="gfs_arch.png" height=500 align=right />  
  master -> namenode， chunkserver -> datanode，client和chunkserver都不cache data

  - chunk && chunkserver
    - 文件被分成fixed-size chunks，每个chunk具有全局唯一id(chunk handle)
    - chunkserver将chunk当做linux文件存在本地磁盘，根据chunk handle和byte range读写chunk data，默认三副本保存。

  - master负责：
    - 维护整个文件系统的metadata，包括：namespace, access control information, the mapping from files to chunks, and the current locations of chunks
    - 控制system-wide activities，包括：chunk lease management, garbage collection of orphaned chunks, and chunk migration between chunkservers.
    - The master periodically communicates with each chunkserver in HeartBeat messages to give it instructions and collect its state.

  - client:
    - 实现文件系统API
    - 和master通信实现对metadata的operations
    - 和chunkserver通信read/write data

## Single Master   

  single master极大的简化了设计，使得master可以利用全局信息make sophisticated chunk placement and replication decisions.

  当然，必须最小化master在文件系统读写中的工作，这样single master才不会成为系统的bottleneck。client never通过master读写file data。client请求mater来获取自己需要和那台chunkserver交互。client从master拿到的信息需要cache。

## Chunk size
  64M

## Metadata
    3种metadata：
      - the file and chunk namespaces
      - the mapping from files to chunk
      - the locations of each chunk's replicas
    所有的metadata都在内存中，前两种会通过log mutation操作持久化大operation log中，保存在本地磁盘，同时会在其他的机器保存副本。
    利用log使得更新master的状态简单可靠，不存在master crash后不一致的风险。master不会持久化chunk的location信息，而是当chunkserver加入或者master启动的时候请求chunkserver得到.

### In-Memory Data Structures
### Chunk Locations
### Operation Log
  operation log包含重要metadata变化的历史记录，master利用operation log的checkpoint恢复。

## Consistency Model

### GFS保证
    File namespace mutations是原子操作。namespace locking保证原子性和正确性，master的operation log定义了operation的
total order。


# System Interactions
    系统设计是最小化master在所有operation中的参与度。
    we now describe how the client, master, and chunkservers interact to implement data mutations,
    atomic record append, and snapshot.

## Leases and Mutation order
  master通过lease来管理primary和replication和mutation。

## Data Flow

## Atomic Record Appends

## Snapshot   


# Master Operation
## Namespace management and locking
  GFS没有per-directory的数据结构，来列出一个目录下的所有文件，不支持类似linux中的符号链接，硬链接。
  GFS保存完成的文件路径和metadata，到一张lookup table。采用前缀压缩，可以高效的在内存中存储这张表。
  namespace tree中的每个节点都关联一个read-write lock。

  没有directory或者inode-like的数据结构，可以同时并发修改一个目录。

## Replica Placement  



# Fault Tolerance And Diagnosis
