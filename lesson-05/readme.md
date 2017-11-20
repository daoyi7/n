## 第五课

用模拟数组测试async的异步请求

例子中首先创造一个数组， `async.mapLimit()` 方法从这个数组里面异步调用并规定并发数量最高为 5

调用方法是上面自定义的 `fetchUrl()`

可以看到在 `fetchUrl()` 里 `concurrencyCount` 在增加，但是还有一个定时器让 `concurrencyCount` 在减少。 当 `concurrencyCount` 加到异步最大数量的的时候，就开始执行定时器里的方法。这样就保持着数量为 5 的最高并发数
