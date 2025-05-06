## Demystifying SSL/TLS

**Condifentiality**:  data should be encrypted so hacker cannot understand the content if he hacks it

**Integrity**: Data is not modified between Client and Server

**Authentication**: Client/Server are indeed who they say they are


*Anti-Replay*: 

* Provided with bullt-in sequence numbers
* Built in to Integrity + Authentication mechanism

*Non-Repudiation*:

* Sender cannot later deny sending a message
* Byproduct of Integrity + Authentication


## RSA

The first step of encrypting a message with RSA is to generate the keys. To do this, we need **two prime numbers (p and q)** which are selected with a primality test:

```js
p = 907
q = 773

n = 907 x 773 = 701,111

// once we have n, we use Carmichael’s totient function:
λ(n) = lcm (p − 1, q − 1)  // lcm means the lowest common multiple, e.g lcm(4, 6) = 12
λ(701,111) = lcm (907 − 1, 773 − 1)
λ(701,111) = lcm (906, 772)
λ(701,111) = 349,716

// note that if the receiver was asked to calculate λ(701,111), then it is incredibly hard (at least before quantum computing) to do reverse engineering to get the result 349,716 
```

now it's time to figure out our public key. Under RSA, public keys are made up of **a prime number `e`, as well as modulus `n`**. The number `e` can be anything between 1 and  `λ(n)` so that `1 < e < λ(n)`, and `e` can be random because `e` is just part of the public key, so in practice, `e` is generally set at 65,537 (**nearly everyone universally uses 65,537 as their prime exponent**), and we just let `e` to be a small number "11" in this example:

```js 
e = 11

c = m^e mod n  //<-------------------------------
               // note that (^e mod n) part is the public key, not just e 

// let say we want to encrypt a very simple number "4"
c = 4^11 mod 701,111 
c = 4,194,304 mod 701,111
c = 688,749   // this gives us the plaintext of 4 to the ciphertext of 688,749
```

so `...(^11 mod 701,111)` is our **public key** (where `...` mean a number to be encrypted), now let's generate the **private key** which are made up of `d` and `n`:

```js
d =e^(-1) mod λ(n)  // this is call modular inverse, e.g  5^(-1) mod 7 is 3, because 3*5 mod 7 = 1
d =1/e mod λ(n)     // we can also represent modular inverse in this form

d =1/11 mod 349,716
d = 254, 339
```

now we have the **private key** `...^d mod n`

```js
m = c^d mod n  //<-------------------------------

m = 688,749254,339 mod 701,111
m = 4
```

note that the size of RSA key is the the modulus `n` in bits, so in the above example, the RSA key size is 20 bits (701,111's binary form has 20 digits), and since the public and private key of a given pair share the same modulus, they also have, by definition, the same "length".

this post explains the structure of public/private key in great details: https://crypto.stackexchange.com/a/35105/109954


## Diffie-Hellman

The purpose of Diffie-Hellman is to establish an share secret which can in turn be used to generate Symmetric keys:

```js
Alice                                (Step One)                     Bob
                                 Agree upon two numbers
                                 P (prime number) 13            
                                 G (Generator)     6

private key = 5                                                      private = 4               (Step Two): each party randomly generate a Private Key

public key                                                           public key                (Step Three): calculate public keys
   = (G^private) MOD P                                                  = (G^private) MOD P
   = (6^5) MOD 13                                                       = (6^4) MOD 13
   = 2                                                                  = 9
   
   -----------------------------------------------------------------> Alice public key = 2      (Step Four): each party exchange public key
Bob public key = 9 <-------------------------------------------------- 

share secret                                                          share secret               (Step Five): calculate share secret, both party gets a identical secret
   = (share public^ private) MOD P                                       = (share public^ private) MOD P
   = (9^5) MOD 13                                                        = (2^4) MOD 13
   = 3                                                                   = 3

                       (Step Six): the shared secret is used to generate a symmetric key to further encrypt communication
```

To summary:

RSA can be used for **Encryption**, **Signatures** and **Key Exchange**
Diffie-Hellman can only be used for **Key Exchange**
Digital Signature Algorithm can only be used for **Signatures**


## Certificate

the structure of a certificate

(Certificate Data)
* Version
* Serial Number
* Signature Algorithm
* Validity
* Subject and Issuer
* Public Key
* Extension
(Certificate Data)
(Signature Algorithm) <---------duplicated for a purpose (defense attacks, don't need to worry about the details)
....................
(Signature Algorithm)
(Signature)
...........
(Signature)
...


```bash
openssl x509 -in xxx.cert -text -noout
openssl x509 -in xxx.cert -noout -modulus
openssl rsa -in xxx.key -noout -modulus
```


```bash
openssl x509 -in google.com-cert -text -noout

Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number:
            9e:59:7d:0f:c7:27:bf:68:0a:4e:0d:57:6d:46:e9:09
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: C = US, O = Google Trust Services LLC, CN = GTS CA 1C3
        Validity
            Not Before: May 22 08:17:22 2023 GMT
            Not After : Aug 14 08:17:21 2023 GMT
        Subject: CN = *.google.com
        Subject Public Key Info:
            Public Key Algorithm: id-ecPublicKey
                Public-Key: (256 bit)
                pub:
                    04:6b:0a:99:bb:9d:0b:e6:4b:45:98:65:05:76:09:
                    6a:b0:66:ea:7d:6c:9b:e4:43:f9:64:4a:87:c4:8d:
                    96:56:ef:f3:69:0a:d0:d9:6f:88:61:cc:c0:af:df:
                    72:03:c6:d1:2f:0a:fa:55:0f:07:fe:e7:af:e5:83:
                    10:1f:84:ec:26
                ASN1 OID: prime256v1
                NIST CURVE: P-256
        X509v3 extensions:
            X509v3 Key Usage: critical
                Digital Signature
            X509v3 Extended Key Usage:
                TLS Web Server Authentication
            X509v3 Basic Constraints: critical
                CA:FALSE
            X509v3 Subject Key Identifier:
                68:74:CC:E5:B8:30:BD:8B:50:84:6A:95:89:AA:C5:92:E7:5C:AF:2E
            X509v3 Authority Key Identifier:
                8A:74:7F:AF:85:CD:EE:95:CD:3D:9C:D0:E2:46:14:F3:71:35:1D:27
            Authority Information Access:
                OCSP - URI:http://ocsp.pki.goog/gts1c3
                CA Issuers - URI:http://pki.goog/repo/certs/gts1c3.der
            X509v3 Subject Alternative Name:
                DNS:*.google.com, DNS:*.appengine.google.com, DNS:*.bdn.dev, DNS:*.origin-test.bdn.dev, DNS:*.cloud.google.com, DNS:*.crowdsource.google.com, DNS:*.datacompute.google.com, DNS:*.google.ca, DNS:*.google.cl, DNS:*.google.co.in, DNS:*.google.co.jp, DNS:*.google.co.uk, DNS:*.google.com.ar, DNS:*.google.com.au
                ...
            X509v3 Certificate Policies:
                Policy: 2.23.140.1.2.1
                Policy: 1.3.6.1.4.1.11129.2.5.3
            X509v3 CRL Distribution Points:
                Full Name:
                  URI:http://crls.pki.goog/gts1c3/moVDfISia2k.crl
            CT Precertificate SCTs:
                Signed Certificate Timestamp:
                    Version   : v1 (0x0)
                    Log ID    : B3:73:77:07:E1:84:50:F8:63:86:D6:05:A9:DC:11:09:
                                4A:79:2D:B1:67:0C:0B:87:DC:F0:03:0E:79:36:A5:9A
                    Timestamp : May 22 09:17:26.443 2023 GMT
                    Extensions: none
                    Signature : ecdsa-with-SHA256
                                30:46:02:21:00:DF:EC:D2:8B:6C:15:AE:11:64:AB:27:
                                D9:04:CB:C6:92:B0:B9:82:78:75:2A:DB:1F:01:6C:CD:
                                A8:E4:20:74:DB:02:21:00:E3:8F:3D:51:98:90:7F:F4:
                                15:E9:65:D6:61:41:F4:C3:57:C4:66:A7:5D:A3:9A:E1:
                                11:15:92:15:73:1A:5B:BE
                Signed Certificate Timestamp:
                    Version   : v1 (0x0)
                    Log ID    : AD:F7:BE:FA:7C:FF:10:C8:8B:9D:3D:9C:1E:3E:18:6A:
                                B4:67:29:5D:CF:B1:0C:24:CA:85:86:34:EB:DC:82:8A
                    Timestamp : May 22 09:17:26.234 2023 GMT
                    Extensions: none
                    Signature : ecdsa-with-SHA256
                                30:46:02:21:00:8F:17:75:C5:0F:CA:E0:5C:5F:60:CA:
                                83:1D:76:32:5B:81:13:1C:30:C5:54:BA:D2:2E:0B:8A:
                                6C:D8:D5:BA:AF:02:21:00:AA:38:57:FD:06:80:7D:EA:
                                D8:DE:6C:11:2E:11:96:26:22:27:1B:5E:CD:97:CD:C6:
                                07:12:EF:85:0B:4E:8B:BF
    Signature Algorithm: sha256WithRSAEncryption
    Signature Value:
        7b:5c:87:72:54:a2:3f:6e:1a:fa:c4:78:c9:03:3b:eb:7f:ed:
        6a:42:d3:0a:61:2a:da:2a:ed:ee:3f:90:5c:f6:87:55:44:0b:
        03:d5:c7:57:d2:8e:25:4a:7f:4b:b4:8c:70:26:62:ab:ca:19:
        f3:b6:27:67:d8:1b:be:68:9b:0e:fd:1a:f9:51:60:8b:2e:17:
        9f:93:d7:9b:74:e7:ce:67:aa:8f:1a:71:fb:99:ee:0f:61:af:
        1f:eb:4a:8a:48:20:5a:f2:11:9c:1f:9e:b8:dc:4a:8d:e4:bf:
        e3:cc:13:0a:e6:7a:64:d9:35:b6:0c:83:53:df:37:90:60:89:
        ea:08:5c:ed:24:a5:83:72:0d:ca:87:6f:f9:5d:f8:8b:fc:44:
        f0:89:19:7e:1c:41:92:32:bc:64:5a:fb:d3:57:a8:72:3b:6b:
        c9:58:0b:8b:fc:e2:60:46:ba:d2:31:4f:d8:e1:7a:ac:c8:15:
        93:5a:ee:bf:f4:07:67:45:ee:ef:c3:27:be:0b:de:45:8b:69:
        e1:0f:fe:29:52:8a:50:a5:84:01:d7:2e:44:52:47:98:c3:fc:
        15:ca:f1:26:e5:60:b7:e4:08:f4:41:47:be:27:83:02:49:b4:
        8d:21:2b:13:4c:76:fa:50:ff:96:aa:3a:ec:6f:ca:46:fb:cd:
        44:d7:e6:5a
```

## Overall Process of SSL/TSL process

1. Certificate Authority (CA) has public key, private key and Self-Signed Certificate

2. Server generates its public key and private key and it want to acquire a Certificate by sending a Certificate Signing Request (CSR), note that CSR contains Server's public key and CSR is signed by server's Private key

3. CA inspects and validates information in the CSR, if everything good, CA creates a Cerfiticate and signed with CA's Private key, then this certificate is sent back to the server

4. Client(Browsers) alread have CA Certificate installed locally and request Server's Certificate

5. Once Client receives the server's certificate, Client does:

   a. Validate Certificate is legitimate:

      * Client decrypts the certificate's signature (origianlly, CA hashed Certificate Data by its Signature Algorithm) with CA's public key (client has it locally)
      
      * Client re-calculates the hash of Certificate Data and compare with the decrypted signature above

   b. Validate that Server truly owns Certificate (can have two methods):
      
      * Method One (RSA): 
        * Client generates a random value
        * Client encrypts value with the server's public key and then send it across the wire
        * Server decrypts with server's private key to extract original value (note that the server won't send this value back to client to verify)
        * Both party uses this value to **directly** generate session/symmetric keys further (if both party can encrypt/decrypt application data, then it means server is the true owner)

      * Method Two (RSA + Diffie-Hellman):
        * In the handshake, Server sends a Diffie-Hellman public key (public key is 9 if Bob is deemed as the server in the DH example above) to the client. Note that both value (public key 9) and signature are sent to client
        * Client validate signature using Server's public key and send this public key along with the signature (including hashing) are sent to the client
        * Client uses server's public key to decrypt the signature and re-calculate the hash to comare,  and it is ok that server send this public key explicitly on the wire, since this public key will only being used **indirectly** combined with client's own private key (5 as Alice's private) to generate the seed value (3 as shared secret)

You might ask why Client needs to use one of these two methods to validate the server owns Certificate becuase browser can just compare the URL with the Common Name inside the certificate. This step is nescessary because a hacker can use a valida certificate and intecept your request to the real domain, which client will think the hacker is the true owner, but with this valdiation method, since hacker doesn't have the private key to decrypt, so client know something is wrong. Image this scenario-DNS Spoofing or Network Hijacking:

1. A user types https://example.com

2. A hacker hijacks DNS or tampers with the network (e.g., rogue Wi-Fi hotspot)

3. The browser does go to example.com, but ends up connecting to the hacker’s IP

4. The attacker presents a copied certificate for example.com (CN matches!)

5. ❌ If the browser didn’t verify the attacker had the private key, it would trust the cert

So even though the URL and CN match, the attacker must still prove private key ownership, or else the handshake will fail.

Also note that public key and private key are same kind, you choose one to be public key, then the other key will be private key. TLS uses public key to encrypt data, but for certificate signature, it uses private key (not public key this time) to encrypt the hash of certificate, so later client can use public key to decrypt it.
