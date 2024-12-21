# 抽离与复用

虽然js不像传统的面向对象语言那样特性，但是我们依然可以做出封装与集成 来达到复用和管理的目的！

## 要求
```
|--phone.js
  | --impl
     |-- nokia.js
     |-- iphone.js
```

要求 以后不管制造哪个手机，用户都可以使用此类原获取方法

```js
const phone = Phone.getInstance("nokia");
phone.sayHi(); // 输出 nokia say hi
```

## 具体实现

### 定义基类

此类提供 Phone 公共方法,当然也它也拥有继承子类的方法。  
可以在这里做对子类的二次把控  （没有ts的加持的情况下，这么做没问题）

phone.js

```js
// 动态导入所有具体实现的个性类，如果嫌这样浪费性能，可以在基类的getInstance里动态导入单个类
const requireModules = import.meta.glob("./impl/**/*.ts", { eager: true });
let modules: any = {};
for (const path in requireModules) {
  const moduleConent: any = requireModules[path];
  modules[moduleConent.default.name] = moduleConent.default;
}

/**
 * 基类Phone，本质上工具类函数
 */
export default class Phone {
  static version = "1.0";
  static getInstance(type: string) {
    // 这才是基基类 （实现了动态继承）
    class InnerClass extends modules[type] {
      constructor() {
        super();
      }
      sayHi() {
        super.sayHi();
      }
    }
    return new InnerClass();
  }
}
```

### 子类具体实现
子类有组内其他成员定义，但是要求必须实现基类用到的属性或方法（如果是 ts 可以通过 interface 约束，否则只能绩效约束）！

基础例子

```js
// impl/nokia.js
export default class Nokia {
  static name = "nokia";
  sayHi() {
    console.log("nokia say hi");
  }
}
```

还可以继续继承

```js
// impl/nokia.js
import live from "Device";

export default class Nokia extends Device {
  static name = "nokia";
  constructor() {
    super();
  }
  sayHi() {
    console.log("nokia say hi");
    // 这里还可以调用更上级父类的方法
    super.hi();
  }
}
```


还可以Ts约束

```ts
// PhoneInterface.ts
export default interface PhoneInterface {
    sayHi(): void;
  }
```

```ts
// impl/nokia.ts
import live from "Device";

export default class Nokia extends Device implements PhoneInterface {
  static name = "nokia";
  constructor() {
    super();
  }
  sayHi() {
    console.log("nokia say hi");
    // 这里还可以调用更上级父类的方法
    super.hi();
  }
}
```

## 优点
```js
const phone = Phone.getInstance("nokia");
```

* 这个 phone 对象拥有每一层父级的所有方法和属性，包括公共Phone类的统一基类方法！ 
* phone 类，可以作为约束和统筹具体实现类（也就是父类）的作用。
* 具体实现类还可以继续继承或者使用ts的接口去强制约束。



---

## 还可用另一种写法

多态
```ts
interface PhoneInterface {
  sayHi(...arg:any[]):void;
}

class Phone implements PhoneInterface {
  static version = '1.0';
  sayHi(){
    console.log('phone say hi');
  }
}

class Nokia extends Phone implements PhoneInterface {
  sayHi(){
    console.log('nokia say hi');
    
  }
}
const createPhoneFactory = (_class: typeof Phone) => new _class() //这里体现的就是多态
const nokia = createPhoneFactory(Nokia);
nokia.sayHi()
```