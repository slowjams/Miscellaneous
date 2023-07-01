## Demystifying Anisble

```js
cd "/home/ansible/diveintoansible/Ansible Architecture and Design/Inventories/01"

// when  "An attempt was made to access a socket in a way forbidden by its access permissions" error occurs
net stop winnat
netsh int ipv4 set dynamic tcp start=49152 num=16384
netsh int ipv6 set dynamic tcp start=49152 num=16384
net start winnat
//

/home/ansible/.ssh/known_hosts

ANSIBLE_HOST_KEY_CHECKING=False ansible all -m ping   // all is a special group that all hosts get assigned to the "all" group automatically
```


Ansible Configuration Files in the following priority order

1. `ANSIBLE_CONFIG` (Environment Variable)
2.  `./ansible.cfg` (in the current directory)
3.  `~/.ansible.cfg` (a hidden file, in user's home directory)
4.  `/etc/ansible/ansible.cfg`


```js
ansible --version
//config file = None
// ...

su -
mkdir /etc/ansible
touch /etc/anisble/ansible.cfg
ansible --version
//config file = /etc/ansible/ansible.cfg
// ...

exit  // exit the root mode
touch .ansible.cfg
ansible --version
//config file = /home/ansible/.ansible.cfg
// ...
```

`cat ansible.cfg`:
```js
[defaults]
inventory = hosts
host_key_checking = False   // without `host_key_checking`, you have to do `ANSIBLE_HOST_KEY_CHECKING=False ansible all -m ping`, it    
                            // automatically generates `.ssh/known_hosts` file that contans the finger print of the server's public key
                           
```

`cat hosts`:
```js
[all]
centos1
```

using range `[:]` and `var`

```js
//-------------------------------V without range and var
[control]
ubuntu-c ansible_connection=local

[centos]
centos1 ansible_user=root ansible_port=2222
centos2 ansible_user=root
centos3 ansible_user=root

[ubuntu]
ubuntu1 ansible_become=true ansible_become_pass=password
ubuntu2 ansible_become=true ansible_become_pass=password
ubuntu3 ansible_become=true ansible_become_pass=password
//-------------------------------Ʌ

//--------------------------------V with range and var
[control]
ubuntu-c ansible_connection=local

[centos]
centos1 ansible_port=2222   // overwrite all:vars
centos[2:3]

[centos:vars]
ansible_user=root

[ubuntu]
ubuntu[1:3]

[ubuntu:vars]
ansible_become=true
ansible_become_pass=password

[linux:children]
centos
ubuntu

[all:vars]
ansible_port=1234
//--------------------------------Ʌ
```