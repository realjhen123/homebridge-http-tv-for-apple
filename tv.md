# 项目说明
你为homebridge编写插件,用于通过iPhone的Remote App控制电视,其中电视可以用http api控制.
# API
method: GET
base url: http://north.autohome.api.home/tv
开关: /on /off
方向键: / left right up down sure back
声音调节: / v_up v_down
直播键: /stream
# 项目细节
你需要实现在iPhone Remote App中使用方向键、information键、back键.
你不需要考虑API的实现.在没有得到 用户表达的 确切的 同意 前,不得测试API、调用API,这可能造成不必要的麻烦.
你需要确保可以运行,所有给出的API需要在一个名为 api.ts的文件中管理.
# 技术栈
使用TypeScript编写, 使用npm编译
# git
你使用git.
## commit
commit 需要给出详细的说明,并在你完成任何文件修改后进行.
# 当你阅读完本文件后
当你阅读完本文件后,你需要在doc/下建立文档,说明详细的实现方法、你的思路
待我确认后,再开始coding