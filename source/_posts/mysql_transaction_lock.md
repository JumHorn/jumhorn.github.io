---
title: 数据库事务的锁
date: 2024-02-18 22:24:41
tags: 架构
---

# 锁

> https://dev.mysql.com/doc/refman/8.0/en/innodb-locking.html

1. 事务的执行是基于socket连接的，当连接连接中断或者超时，事务会回滚
2. 多个事务执行时，可以开启两个终端测试不同的锁

# 锁的分类

## 共享锁 (Shared Locks)

	共享锁允许多个事务同时读取一个资源，但是不允许写入操作，直到所有的共享锁被释放

```sql
START TRANSACTION;

-- 以共享模式锁定表中的行
SELECT * FROM your_table WHERE some_column = 'value' LOCK IN SHARE MODE;

-- 在事务中可以进行其他的并发读取操作

COMMIT;
```

## 排他锁 (Exclusive Locks)

	排他锁限制对资源的访问，只允许一个事务独占资源。其他事务不能对同一资源进行读取或写入操作

```sql
START TRANSACTION;

-- 以排他模式锁定表中的行
SELECT * FROM your_table WHERE some_column = 'value' FOR UPDATE;

-- 在事务中可以进行更新或删除等操作

COMMIT;
```

## 行级锁 (Record Locks)

	innodb默认使用行级锁，行级锁只会锁定所需的行，而不是整个表。这样其他事务就可以并发地访问表中的其他行
```sql
START TRANSACTION;

-- 在行级别锁定特定的行
SELECT * FROM your_table WHERE id = 123 FOR UPDATE;

-- 在事务中进行其他操作，只锁定了 id 为 123 的行

COMMIT;
```

## 间隙锁(Gap Locks)

	锁定范围区间
```sql
START TRANSACTION;

-- 在行级别锁定特定的行
SELECT * FROM your_table WHERE id >= 3 and id<= 5  FOR UPDATE;

-- 在事务中进行其他操作，只锁定了 id 为 [3,5] 的行，操作其他行不受影响

COMMIT;
```


## 表级锁 (Table-level Locks)

	表级锁会锁定整个表，而不是单个行。这样会阻塞其他事务的读取或写入操作，导致性能问题
```sql
LOCK TABLES your_table WRITE;

-- 在表级别执行写操作

UNLOCK TABLES;

```

## AUTO-INC锁

	该锁是表级锁
	理解主键自增锁是如何设计的，以及事务回滚时主键不是连续的

## 意向锁

	意向锁是由存储引擎提供的，不用用户控制的锁，
	Innodb允许行级锁与表级锁共存，需要解决如下问题
	1. 当事务A想要获取表级排它锁时，如何保证该表上每一行都没有排它锁和共享锁
	2. 当事务A想要获取表级共享锁时，如何保证该表上每一行都没有排它锁

	S: shared lock
	IS: intention shared lock
	X: exclusive lock
	IX: intention exclusive lock

||X|IX|S|IS|
|---|---|---|---|---|
|X|Conflict|Conflict|Conflict|Conflict|
|IX|Conflict|Compatible|Conflict|Compatible|
|S|Conflict|Conflict|Compatible|Compatible|
|IS|Conflict|Compatible|Compatible|Compatible|

横竖的X,IX,S,IS都要理解成表锁，先用该类型的表锁，查询是否可以锁住表。
比如IX,IX两个表锁可以共存，方便他们向下继续进行不同行的行锁，
意向锁的本质就是让行锁和表锁共存，提供不同粒度的锁

# 实际测试

1. 终端1
```shell
mysql>
Query OK, 0 rows affected (0.02 sec)

mysql> select * from users where id=3 for update;
+----+----------+----------+
| id | username | password |
+----+----------+----------+
|  3 | yasuo    | 65c05a0c |
+----+----------+----------+
1 row in set (0.01 sec)

mysql> rollback;
Query OK, 0 rows affected (0.01 sec)
```

2. 终端2
```shell
mysql> update users set mail="yasuo@gmail.com" where id=3;
ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction
```

	其中终端2的命令在终端1开启锁之后rollback之前执行，就可以看到命令执行失败。
	所有锁都可以如此测试查看锁的特性，实际执行过程如下图
|session A|session B|
|---|---|
|start transaction; mysql> select * from users where id=3 for update;||
||update users set mail="yasuo@gmail.com" where id=3;(blocked)|
|rollback;||

# FAQ

1. mysql事务都设置了timeout

	死锁的必要条件(互斥条件/请求与保持条件/不剥夺条件/循环等待条件)
	timeout破环了请求与保持条件，故不会发生死锁