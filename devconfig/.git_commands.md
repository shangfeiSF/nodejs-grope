Welcome to Git Commands Show
===================

## 基本Git命令 ##

Function | Command | Notes
------ | ------ | ------
git版本 | `git --version` |
git-core路径 | `git --exec-path` |
全局级配置 | `git config --global` |
系统级配置 | `git config --system` |
仓库级配置 | `git config --local` |
查看全部配置 | `git config --[global / system / local] --list` | -l
编辑.gitconfig | `git config --[global/system/local] --edit` | -e
查看配置 | `git config --[global/system/local] --get [section.name]` |
添加配置 | `git config --[global/system/local] --add [section.name] [value]` |
删除配置 | `git config --[global/system/local] --unset [section.name]` | 会保留section
设定别名 | `git config --[global/system/local] alias.[short-cmd] [long-cmd]` |
搜索匹配文本 | `git grep -n [text]` |
检查仓库状态 | `git status` |
检查仓库状态 | `git status -s` | 短格式
检查仓库状态 | `git status -s --ignored` | gitignore会被考虑
编辑 INI 文件 | `GIT_CONFIG=[fileName] git config [section—1].[section-n].name value` |
显示.git目录的路径 | `git rev-parse --git-dir` | d:/alibaba/m2ux/demo/.git
显示仓库根目录 | `git rev-parse --show-toplevel` | d:/alibaba/m2ux/demo
显示相对目录 | `git rev-parse --show-cdup` | 2015/xiaoshao
提交修改 | `git commit -m [message]` |
无修改提交 | `git commit --allow-empty -m [message]` |
修正最新提交信息 | `git commit --amend` |
查看提交历史 | `git log --pretty=[oneline/short/medium/full/fuller/email/raw]` | 固定输出格式
查看提交历史 | `git log --pretty=format:'[formated-string]'` | 自定义输出格式
查看历史修改详情 | `git log --patch` | -p/-u
查看历史修改概要 | `git log --stat` |
图形化拓扑 | `git log --graph --pretty=oneline` |
提交历史区间 | `git log --after='[date-string]' --before=[date-string]` | '2015-03-09'
查看差异df1 | `git diff -- [fileName]` | 暂存区 vs 工作区
查看差异df2 | `git diff --cached -- [fileName]` | 版本库 vs 暂存区
查看差异df3 | `git diff HEAD -- [fileName]` | 版本库 vs 工作区

## 版本控制命令 ##


> **Note:** A present **工作区**，B present **暂存区**，C present **版本库**

### reset ###

Command | Function
------ | ------
`git reset --hard HEAD` | 放弃 **A&B** 中的修改, **A&B&C** 重置到 **C** 的最新提交
`git reset --hard` | 同上(reset 默认使用 HEAD)
`git reset --hard HEAD^` | 放弃 **A&B** 中的修改, **A&B&C** 重置到 **C** 的上一次提交
`git reset --hard HEAD^^` | 放弃 **A&B** 中的修改, **A&B&C** 重置到 **C** 的上上一次提交
`git reset --hard [commitID]` | 放弃 **A&B** 中的修改, **A&B&C** 重置到 **C** 中[commitID]对应的提交

> **Note:** HEAD的上角标**^**可以不断增加，或者使用后缀~n来替代较多的^

Command | Function
------ | ------
`git reset --soft HEAD` | 保留 **A&B** 的修改,  **C** 重置到 **C** 的最新提交
`git reset --soft` | 同上(reset 默认使用 HEAD)
`git reset --soft HEAD^` | 保留 **A&B** 中的修改,  **C** 重置到 **C** 的上一次提交
`git reset --soft HEAD^^` | 保留 **A&B** 中的修改,  **C** 重置到 **C** 的上上一次提交
`git reset --soft [commitID]` | 保留 **A&B** 中的修改,  **C** 重置到 **C** 中[commitID]对应的提交

> **Note:** HEAD的上角标**^**可以不断增加，或者使用后缀~n来替代较多的^

Command | Function
------ | ------
`git reset --mixed HEAD` | 保留 **A** 中的修改, **B&C** 重置到 **C** 的最新提交
`git reset ` | 同上(reset 默认使用 --mixed HEAD)
`git reset --mixed HEAD^ ` | 保留 **A** 中的修改, **B&C** 重置到 **C** 的上一次提交
`git reset --mixed HEAD^^ ` | 保留 **A** 中的修改, **B&C** 重置到 **C** 的上上一次提交
`git reset --mixed [commitID]` | 保留 **A** 中的修改, **B&C** 重置到 **C** 中[commitID]对应的提交

### 常用reset ###

Command | Function
------ | ------
`git reset` | 将 **B** (Changes to be committed的内容)中全部撤出到 **A** 即：**git add -A的逆操作**
`git reset -- [filename]` | 将 **B** 中[filename]的修改撤出到 **A** 即：**git add -- [filename]的逆操作**

### checkout ###

Command | Function
------ | ------
`git checkout` | 显示 **A&B** 与 **HEAD** 的差异(汇总显示差异,而git status分别显示 **A B与C** 的差异)
`git checkout [branchname]` | 切换到[branchname]分支
`git checkout HEAD -- [filename]` | 将 **A** 中[filename]对应的内容重置到 **B** 中HEAD对应的内容
`git checkout -- [filename]` | 同上(checkout 默认使用 HEAD)
`git checkout -- .` | 将 **A** 中的修改全部撤销, 重置到 **B**
`git checkout .` | 同上(省略 --)

> **Note:** 以下三个command会在B中出现新的to be committed

Command | Function
------ | ------
`git checkout HEAD^ -- [filename]` | 将 **A** 中[filename]对应的内容重置到 **B** 中HEAD^对应的内容
`git checkout [commitID] -- [filename]` | 将 **A** 中[filename]对应的内容重置到 **B** 中[commitID]对应的内容
`git checkout [branchname] -- [filename]` | 将 **A&B** 中[filename]对应的内容重置为[branchname]分支下[filename]对应内容
### 常用checkout ###

Command | Function
------ | ------
`git checkout [branchname]` | 切换到[branchname]分支
`git checkout -- [filename]` | 重删除A中[filename]对应的内容(放弃本次工作区的修改)


git stash                                  保存当前工作进度(会分别对A&B的状态进行保存)
git stash save [message]                   git stash的完整版, 可以指定说明信息[message]
git stash save --no-keep-index [message]   同上, 其中--no-keep-index 表示保存进度后会重置A&B, 这是stash save的默认选项
git stash save --keep-index [message]      --keep-index 表示保存进度后不会重置A&B
git stash save -k [message]                同上(-k 是 --keep-index)
git stash list                             显示进度列表(查询stashID)
git stash pop [stashID]                    恢复[stashID]指定的进度(默认只恢复A的进度)
git stash pop --index [stashID]            恢复[stashID]指定的进度(--index 表示除了恢复A的进度, 还会尝试恢复B的进度)
git stash apply [stashID]                  恢复[stashID]指定的进度(默认只恢复A的进度), 但是不删除stash list中的记录
git stash apply --index [stashID]          恢复[stashID]指定的进度(--index 表示除了恢复A的进度, 还会尝试恢复B的进度), 但是不删除stash list中的记录
git stash drop [stashID]                   删除[stashID]指定的进度，默认最新进度
git stash clear                            删除stash list中进度
git stash branch [branchname] [stashID]    基于[stashID]创建[branchname]分支

git tag -m [message] [tag_name/tag_version]          里程碑
git describe                                         显示最新的里程碑([tagname]-[version_distance]-[commit_id])
{
  tagname: 里程碑名称
  version_distance: 当前工作区的版本是‘留影’后的第几个版本
  commit_i：提交id
}

rm [file_path/file_name]                             使用rm直接在A中删除文件，对B&C是没有任何影响的(git ls-files可以验证)
git ls-files                                         显示目前B中有哪些文件
git ls-files -m                                      显示修改过的文件
git ls-files --with-tree=[HEAD/commiteID]            显示C中由with-tree指定的提交包含的文件
git cat-file -p [HEAD/commiteID]:[file_name]         显示上一次提交中C中的[file_name]的内容
git cat-file --textconv [HEAD/commiteID]:[file_name] 显示上一次提交中C中的[file_name]的内容
git cat-file -s [HEAD/commiteID]:[file_name]         显示上一次提交中C中的[file_name]的大小

git rm [file_name]        将A中rm的修改提交到B中
如何把git rm了的内容重新找回：
(1){
  git stash
  git reset --hard HEAD
  git stash pop           将B中的deleted: [file_name]恢复到A中的修改
  git ch -- [file_name]   将A中rm [file_name]的修改恢复(恢复[file_name]文件)
}
(2){
  git commit -m '暂时提交删除'
  git cat-file -p HEAD~1:[file_name] > [file_name]
  git commit -m '提交恢复'
}
(3){
  git commit -m '暂时提交删除'
  git show HEAD~1:[file_name] > [file_name]
  git commit -m '提交恢复'
}
(4){
  git commit -m '暂时提交删除'
  git checkout HEAD~1 -- [file_name]
  git commit -m '提交恢复'
}


git mv [file_name] [mew_name]     移动文件

git add -u  [file_name]   提交A中修改和删除的指定文件[file_name]到B中
git add -A  [file_name]   提交A中所有的修改、删除、新建的指定文件[file_name]到B中
git add -i                打开交互界面
git add -f [file_name]    强制提交提交A中所有的修改、删除、新建的指定文件[file_name]到B中


// .gitignore 的作用范围是其所在的目录及其子目录
touch .gitignore
gvim .gitignore
// edit this file
git ss / git sss       不会提示忽略文件的变化

//.gitignore的忽略语法
(1) 使用Linux通配符规则
{
  *  - 0个或者多个字符
  ？ - 1有且仅有一个字符
  #  - 注释行
  [] - 字符组合范围
  \  - 转移符号
}
(2) 路径分隔符开头(/)表示忽略当前目录下的文件，子目录的同名文件不予忽略   /config.js忽略; /test/config.js不忽略
(3) 路径分隔符结尾(/)表示忽略此目录下的所有文件                           src/忽略; src/less也忽略
(4) 叹号开头(!)表示不予忽略, 即使前面设置了忽略规则                       !build/*.js不忽略
(5) 中间带有路径分隔符的规则，忽略文件严格按照路径指明                    doc/tips忽略; doc/server/tips不忽略

// git归档


