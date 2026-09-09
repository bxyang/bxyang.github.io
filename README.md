# yangbaoxing.github.io

个人主页，基于 GitHub Pages。

## 目录结构

- `index.html` — 主页（静态，无 Jekyll front matter）
- `assets/style.css` — 样式
- `bxy_jc.jpeg` — 婚纱照（**仅留作个人文件，不在主页引用**）
- `*.md` — 旧的技术笔记（GFS / Raft / CTR / 因果推断）
- `image/`, `ctr_intr_img/` — 笔记配图
- `_config.yml` — Jekyll 配置（继续渲染 `.md` 笔记）
- `deploy.sh` — 一键部署脚本

## 本地预览

```bash
cd /Users/ridgway/WorkBuddy/personal_site
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## 修改内容

- 个人信息、经历、笔记链接：直接编辑 `index.html`
- 配色 / 间距：编辑 `assets/style.css`
- 经历 / 技能 / 笔记链接：直接编辑 `index.html`（简历内容已内联在主页中）

## 部署

执行 `bash deploy.sh`，脚本会：

1. clone `bxyang/bxyang.github.io` 到临时目录
2. 用本地文件覆盖
3. 列出变更，等你确认
4. 提交并推送到 `master` 分支

推送后 GitHub Pages 通常 1–3 分钟内生效。

## 部署 / SSH 免密

`deploy.sh` 默认走 **SSH**（`git@github.com:bxyang/bxyang.github.io.git`），配好公钥后 push 无需密码或 token。

本机 SSH 已配置：

- 密钥：`~/.ssh/id_ed25519`（ed25519，无 passphrase，已加入 ssh-agent）
- `~/.ssh/config` 指定 github.com 使用该密钥
- `known_hosts` 已写入 GitHub 官方指纹（ED25519 `SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU`）

如果还没把公钥加到 GitHub：

```bash
cat ~/.ssh/id_ed25519.pub | pbcopy   # 复制公钥
# GitHub → Settings → SSH and GPG keys → New SSH key → 粘贴保存
ssh -T git@github.com                # 出现 Hi bxyang! 即为成功
```

改用 HTTPS + token 推送的话，把 `deploy.sh` 里的 `REPO` 换成
`https://github.com/bxyang/bxyang.github.io.git`，密码框填 Personal Access Token
（fine-grained，只勾 Contents 读写）。