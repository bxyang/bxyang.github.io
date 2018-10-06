# Replicated state machines

State Machine：
state variables：编码状态
command：实现状态转移（transform its state）

We have not yet encountered an application that could not be
programmed cleanly in terms of state machines
and clients.

两种具有代表性的faulty behavior
- Byzantine Failures
- Fail-stop Failures

t fault tolerant：系统在给定时间段内，最多不超过t个component挂掉。（类似排队论）

t fault-tolerant version of A State Machine可以通过在分布式系统上复制
The State Machine实现，每个processor运行一个副本。

每个副本初始化到同样的state，以同样的order执行同样的requests，如此，每个副本都做同样的事情，产出同样的结果（Output）。

把所有副本的output ensemble起来，就可以得到一个t fault-tolerant state machine的output。
对于Byzantine Failures，需要2t+1个副本（majority t+1）；
对于Fail-stop Failires，需要t+1个副本。

实现t fault-tolerant state machine需要保证以下：
Replica Coordination：所有副本必须recv和process同样序列的requests。
分解为两个：
- Agreement：每个nonfaulty副本接收每个request
- Order：每个nonfaulty副本按照同样的相对顺序处理他收到的request。

Agreement

Order and Stability

order implementation：
three refinements of The order implementation
- using logical clocks
A logical clock is a mapping T from events to the integers.
如果e导致了e’ , T(e) < T(e')


- synchronized real-time clocks
- using Replica-Generated identifiers


# Tolerant Faulty Output Devices



# The Raft consensus algorithm
首先推选一个leader，然后给于leader完整的权利来管理replicated log。
leader接收来自clients的log entries，复制他们到其他的服务器，告诉服务器什么时候可以安全的apply
 log entries到state machines。

leader approach， raft把一致性问题分解如下三个独立的子问题
- leader election
- log replication
- safety

## Raft basics
