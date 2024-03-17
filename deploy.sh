git init
# 添加
git add -A
# 提交
git commit -am"init"
#分支
git branch -M main
#邮箱账号
git config --global user.email "chenmingmao@126.com"
#用户名
git config --global user.name "YydsChen"
#仓库
git remote add origin git@github.com:yydschen/hugoblog.git

#强制推送到 develop 分支
git push -f origin main

