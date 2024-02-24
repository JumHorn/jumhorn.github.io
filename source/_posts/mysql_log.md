---
title: 数据库日志
date: 2024-02-19 17:45:39
tags: 架构
---

# 日志

	1. mysql如何通过日记实现不同类型的锁
	2. mysql如何通过日志实现主从复制

# binlog

	Binlog 是 MySQL 中用于记录所有对数据的修改操作的一种二进制日志文件。用于数据的备份和恢复。
	它记录了执行的所有数据修改语句，如 INSERT、UPDATE、DELETE 等，但不包括 SELECT 查询。
	Binlog 是用于复制、恢复和灾难恢复的关键工具。通过在主服务器上创建 Binlog，可以将数据复制到从服务器上。
	Binlog 可以启用主从复制（master-slave replication）和事务日志（transaction logging）等功能

# redolog

	Redo Log 是 InnoDB 存储引擎特有的日志文件，用于记录事务所做的修改操作。用于数据写入磁盘和持久化。
	它在事务提交时记录数据页的物理变更，而不是逻辑变更。
	Redo Log 的作用是在数据库崩溃时，通过重新执行重做日志中的操作，来恢复数据库到事务提交之后的状态，确保数据的	一致性和持久性。
	Redo Log 是循环写的，所以相对于数据文件的大小，它比较小。

# undolog

	Undo Log 也是 InnoDB 存储引擎特有的日志文件，用于在事务回滚或者 MVCC（多版本并发控制）中提供数据的一致性。
	当一个事务执行时，如果需要对数据进行修改，则会先将原始数据写入 Undo Log，然后再进行修改。这样可以在事务回滚时使用 Undo Log 来撤销对数据的修改操作，保证事务的原子性。
	Undo Log 也用于实现 MVCC，通过保存事务之前的数据版本，可以实现读取到数据的快照，而不会被其他事务的修改所影响。
	InnoDB 存储引擎使用 Undo Log 来确保事务的原子性、一致性和隔离性。

# FAQ

1. 多版本并发控制 MVCC(Multi-Version Concurrency Control)

	undo log有什么作用

2. Next-Key Locking

	如何避免幻读