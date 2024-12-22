# Ensure _cgroup_ version is set to v2
_Article last validated on 2024-12-21 using Cilium v0.17.0-rc.0_
<hr/>

To ensure Cilium works properly, _cgroup v2_ must be used.

To verify that you're using _cgroup v2_, ensure Docker is started, then you can run the command `docker info` and you should see the following entry in the output:
`Cgroup Version: 2`

If it is not the case, follow the steps below.

## Solution
### Windows (WSL2)
1. Ensure WSL2 is up-to-date: `wsl --update`
2. Create or update the file located at `%USERPROFILE%\.wslconfig` with this configuration minimally inside:
```
[wsl2]
kernelCommandLine = cgroup_no_v1=all
```
3. Stop WSL with the command `wsl --shutdown`
4. Start WSL with the command `wsl`
5. Ensure Docker is started
6. Run the command `docker info` and make sure you see the following entry in the output: `Cgroup Version: 2`