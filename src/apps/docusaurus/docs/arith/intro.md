---
sidebar_position: 1
---
# 常见的


微前端的核心理念是将前端应用程序看作是一个整体，由多个独立的部分组成。每个部分被视为一个微前端应用，它们可以具有自己的技术栈、开发流程和团队组织。这种方式使得团队可以独立开发和部署各个子应用，减少了协调和合并的复杂性。

## 比较版本
软件基本都有版本号，如何去做出比较呢？   
比如 `1.2`、`1.2.1`、`1.3`、`10.1`   

如果不考虑可能以0为结尾的版本号 如`1.2.0`，我们可以如下。   
```js
const compare = (v1, v2) => {
    const v1Arr = v1.split('.');
    const v2Arr = v2.split('.');
    const minLength = Math.min(v1Arr.length, v2Arr.length);
    for (let i = 0; i < minLength; i++) {
        const v1Item = Number(v1Arr[i]);
        const v2Item = Number(v2Arr[i]);
        if (v1Item !== v2Item) {
            return v1Item > v2Item?'大于':'小于';
        }
    }
    // 都遍历完了还未分出大小，要么相等要么长度不一致
    return v2Arr.length>v1Arr.length?'小于':'等于'; 
}
console.log(compare('1.2', '1.2.1'));
```

否则需要将更改成如下
```js {4,6-7,12} showLineNumbers
const compare = (v1, v2) => {
    const v1Arr = v1.split('.');
    const v2Arr = v2.split('.');
    const maxLength = Math.max(v1Arr.length, v2Arr.length);
    for (let i = 0; i < maxLength; i++) {
        const v1Item = i<v1Arr.length?Number(v1Arr[i]):0;
        const v2Item = i<v2Arr.length?Number(v1Arr[i]):0;
        if (v1Item !== v2Item) {
            return v1Item > v2Item?'大于':'小于';
        }
    }
    return '等于';
}
console.log(compare('1.2', '1.2.1'));
```


## 数组切割
要求，实现一下方法    
根据传入的数组和数字，将其切割，若分割最后剩余不够一组则作为一组即可。
```js
const dyadicArr = (array, num) => {
    const newArr = [];
    const handler = (arr) => {
        if (arr.length > num) {
            newArr.push(arr.splice(0, num));
            handler(arr)
        } else {
            newArr.push(arr)
        }
    }
    handler(array)
    return newArr;

}
console.log(dyadicArr([3, 2, 5, 7, 1], 2));
//打印 [ [ 3, 2 ], [ 5, 7 ], [ 1 ]]
```