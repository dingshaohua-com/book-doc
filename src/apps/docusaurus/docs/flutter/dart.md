# dart简单学习

## 函数
### 具名参数
一般语言中，方法调用不是 类似于这样吗： `add(1,2)`，为什么在dart中我能看到这样的`add(x:1,y:2)`?

大多数语言的普通位置参数（Positional Parameters），如 `add(1, 2)`，参数是按位置顺序传递的。    
而在Dart中，还支持 函数的具名参数（named parameters）传递，用来提高代码的可读性和灵活性。         
显然 后者书写方式，可以显式地为参数指定名称，让函数调用更加清晰，尤其是在参数较多或意义不明显时。

```dart
// 使用具名参数的函数
int add({required int x, required int y}) {
  return x + y;
}

void main() {
  print(add(x: 1, y: 2)); // 输出: 3
}

// 说明：   
// 花括号 {} 表示这些参数是具名参数。   
// required 关键字确保调用时必须传递这些参数，否则会报错。   
// 调用时使用 x: 1，y: 2 明确说明哪个参数对应哪个值。 
```


😊 总结：为什么使用具名参数？   
提高可读性：当参数较多时，可以更清晰地知道每个参数的含义。   
顺序无关：调用时参数的顺序可以随意。 `add(y: 2, x: 1); // 也是合法的`    
可选参数支持：具名参数默认是可选的，但可以通过 required 指定为必填。


### 嵌套调用

Dart支持将函数作为参数传递，Flutter的Widget开发方式正是基于这一特性。
```dart
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(
      title: Text('Flutter Demo'),
    ),
    body: Center(
      child: Column(
        children: [
          Text('Hello, World!'),
          ElevatedButton(
            onPressed: () {},
            child: Text('Click Me'),
          ),
        ],
      ),
    ),
  );
}
```

每个Widget（如Scaffold、AppBar等）都是一个函数调用，接受其他Widget作为参数。   
这种嵌套结构依赖于Dart支持将函数返回值作为参数传递，类似树形结构构建UI。   

😊 其实大多数编程语言（如js、Python、Ruby）都支持函数嵌套调用，只不过在flutter中dart将这一特性使用的更频繁而已！
