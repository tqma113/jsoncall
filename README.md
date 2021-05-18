# jsoncall

A schema for description of json call.

|          |Express/Koa等传统的 Web 框架 |GraphQL|Farrow|gRpc|JSONCall|
|----------|---------------------------|-------|------|----|--------|
| 类型安全   | ❌|❌|✅|❌|✅|
|Validation|❌|✅|✅|  |✅|
|自定义类型|❌|✅|✅| |✅|
|encode/decode|❌|❌|❌| |✅|
|schema|❌|✅|✅| |✅|
|跨语言/平台|✅|✅|❌|✅|✅|

- 类型安全
- Type + Validation + encoder/decoder 一体化
- 代码生成：Schema <-> Server/Client Code，只需要定义一次，然后只需要关注/编写业务代码
- GraphQL 的 Schema overload 太多，一份类型模型要写 4 遍
- Farrow 只支持 TS 相关的内容，没有 encode/decode
- JSONCall 是底层实现无关的，可以是基于 HTTP 请求，可以是基于其他的 RPC 方案，甚至可以本地的函数调用，比如 TS 中调用 Rust 的函数
- TS 中调用 Rust 的函数，目前已有的方案非常麻烦，要自己做做很多的validation、format、encode、decode，这个在 Native 和 webview 数据交互的 bridge 中有很大的应用空间
