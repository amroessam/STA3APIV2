@echo off
H:
cd MongoDB\bin
mongod.exe --storageEngine=mmapv1 --dbpath=D:\STA3APIV2\db --repair
mongod.exe --storageEngine=mmapv1 --dbpath=D:\STA3APIV2\db