# 项目说明
你为homebridge编写插件,用于通过iPhone的Remote App控制电视,其中电视可以用http api控制.
# 可以使用的API
method: GET
base url: http://north.autohome.api.home/tv
开关: /start
方向键: / left right up down sure back
声音调节: / v_up v_down
直播键: /stream
# 项目细节
你需要实现在iPhone Remote App中使用方向键、information键、back键.
在测试过程中你可以随时调用api进行测试.
你需要确保可以运行,所有给出的API需要在一个名为 api.ts的文件中管理.
# 技术栈
使用TypeScript编写, 使用npm编译
# git
git remote git@git.home:homebridge-http-tv-for-apple.git
## commit格式
类型: 详细的解释
类型可以为 feat fix debug test new release doc
其中feat为添加功能
fix为修复bug
debug为修复bug时的测试
test为测试
new为新建文件、文件夹
release为成型的、可用的、经过测试的release版本
doc为文档操作
## commit 时机
你需要在执行完任何修改后执行 commit和push
# 当你阅读完本文件后
当你阅读完本文件后,你需要在doc/下建立文档,说明详细的实现方法、你的思路
待用户确认后,再开始coding