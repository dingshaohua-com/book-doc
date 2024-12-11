# 数据结构
在 Bash 脚本中，除了数组（包括索引数组和关联数组），没有其他内置的数据结构，如列表、集合、字典或类等，这些在其他编程语言中很常见。Bash 设计为一个简单的命令语言，因此其编程能力有限，主要适用于简单的脚本和自动化任务。

## 数组
以下是shell定义一个简单的数组
```
arr=("a" "b" "c")
```

关联数组
关联数组方法适合需要更多操作灵活性和可读性的场景，但需要 Bash 4.0+ 的支持。   
Bash 中的关联数组的key和val都只能是字符串。

declare -A 是 Bash 中用来声明 关联数组的命令
```shell
declare -A user =(
    ["id"]="123"
    ["name"]="Alice"
    ["role"]="Admin"
)
echo "Name: ${user["name"]}"
```


## 对象
那对象该怎么写？
如上，使用关联数组来模拟


### 数组嵌套对象
```shell
# 定义多个用户
declare -A user1=(["id"]="123" ["name"]="Alice" ["role"]="Admin")
declare -A user2=(["id"]="124" ["name"]="Bob" ["role"]="User")
declare -A user3=(["id"]="125" ["name"]="Charlie" ["role"]="Guest")

# 将用户存储在一个普通数组中
class=("user1" "user2" "user3")

# 遍历班级数组
for user_ref in "${class[@]}"; do
    declare -n user="$user_ref"  # 使用声明引用关联数组
    echo "ID: ${user["id"]}, Name: ${user["name"]}, Role: ${user["role"]}"
done
```


### 使用字符串序列化用户信息
```shell
# 定义班级数组，存储序列化的用户信息
class=(
    "id=123,name=Alice,role=Admin"
    "id=124,name=Bob,role=User"
    "id=125,name=Charlie,role=Guest"
)

# 解析并访问每个用户的信息
for user_data in "${class[@]}"; do
    IFS=',' read -ra fields <<< "$user_data"  # 按逗号分割字段
    declare -A user
    for field in "${fields[@]}"; do
        IFS='=' read -r key value <<< "$field"  # 按等号分割键值
        user["$key"]="$value"
    done
    echo "ID: ${user["id"]}, Name: ${user["name"]}, Role: ${user["role"]}"
done

```

### 方法对比

| **方法**             | **优点**                                     | **缺点**                                   |
|----------------------|---------------------------------------------|-------------------------------------------|
| **方法 1**: 引用变量名 | 更接近对象的定义，支持灵活操作              | 需要额外管理变量名，不够紧凑               |
| **方法 2**: 序列化    | 存储结构紧凑，易于遍历                     | 需要解析字符串，操作稍显繁琐               |

### 选择建议
- 如果需要对用户对象进行复杂操作（例如增删字段），推荐 **方法 1**。
- 如果数据量大且仅需要简单读取，推荐 **方法 2**。

### 其它方式
**嵌套关联数组**   
本质还是关联数组
```shell
# 定义嵌套关联数组
declare -A users=(
    ["123"]='["id"]="123" ["name"]="Alice" ["role"]="Admin"'
    ["124"]='["id"]="124" ["name"]="Bob" ["role"]="User"'
    ["125"]='["id"]="125" ["name"]="Charlie" ["role"]="Guest"'
)

# 访问方式
for user_id in "${!users[@]}"; do
    eval "declare -A user=(${users[$user_id]})"
    echo "ID: ${user[id]}, Name: ${user[name]}, Role: ${user[role]}"
done

```

**用数组存储用户对象**
本质还是 普通数组
```shell
# 定义数组存储用户对象
users=(
    '(["id"]="123" ["name"]="Alice" ["role"]="Admin")'
    '(["id"]="124" ["name"]="Bob" ["role"]="User")'
    '(["id"]="125" ["name"]="Charlie" ["role"]="Guest")'
)

# 遍历数组
for user_data in "${users[@]}"; do
    eval "declare -A user=${user_data}"
    echo "ID: ${user[id]}, Name: ${user[name]}, Role: ${user[role]}"
done

```