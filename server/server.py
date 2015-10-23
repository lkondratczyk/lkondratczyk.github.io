# To change this license header, choose License Headers in Project Properties.
# To change this template file, choose Tools | Templates
# and open the template in the editor.

__author__ = "lkondratczyk"
__date__ = "$Sep 24, 2015 1:04:27 PM$"

from socket import *

serverPort = 12000
serverSocket = socket(AF_INET, SOCK_STREAM)
serverSocket.bind(('',serverPort))
serverSocket.listen(1)
print('The server is ready to receive')
while True:
    print('1')
    connectionSocket, addr = serverSocket.accept()
    print('2')
    sentence = connectionSocket.recv(1024)
    print('3')
    capitalizedSentence = sentence.upper()
    print('4')
    connectionSocket.send(capitalizedSentence)
    connectionSocket.close()
    