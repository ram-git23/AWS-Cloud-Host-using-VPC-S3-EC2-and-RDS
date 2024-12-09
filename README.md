# AWS Cloud Host using VPC, S3, EC2 and RDS

### The following steps demonstrate the hosting of a simple website with S3 as Frontend, EC2 as Backend, RDS as Database in a custom VPC

1. Create a VPC

- Name: `myVPC`
- CIDR block: `10.0.0.0/24`

2. Create two subnets in two different availability zones to separate RDS and EC2

Public subnet:

- VPC: `myVPC`
- Name: `myPublicSubnet`
- CIDR block: `10.0.0.0/25`
- AZ: `us-east-1a`

Private subnet:

- VPC: `myVPC`
- Name: `myPrivateSubnet`
- CIDR block: `10.0.0.128/25`
- AZ: `us-east-1b`

3. Create Internet Gateway (IGW) to enable instances in your VPC to connect to the Internet

- Create Internet Gateway `myIG` and attach it to `myVPC`

4. Create two route tables for the previously created subnets

Create public route table:

- Name: `myPublicRoute`
- Subnet association: `myPublicSubnet`
- Route: Add route `0.0.0.0/0` to internet gateway `myIG`

Create private route table:

- Name: `myPrivateRoute`
- Subnet association: `myPrivateSubnet`

5. Create S3 bucket and enable Staic Web Hosting

- Name: `myfrontendbucket` (Should be globally unique)
- Disable ACLs
- Uncheck Block all public access
- Click on 'Create'
- Upload the frontend files
- Add the following bucket policy:
  ```
  {
  "Version": "2012-10-17",
  "Statement": [
  {
  "Effect": "Allow",
  "Principal": "*",
  "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::my-static-website-bucket/*"
  }
  ]
  }
  ```
- Enable Static Web Hosting

6. Create EC2 instance to run the backend server

- Name: `myServer`
- AMI: `Ubuntu`
- Instance type: `t2.micro`
- Key Pair: Create new key pair if you don't have one
- VPC: `myVPC`
- Subnet: `myPublicSubnet`
- Auto-assign public IP: Enable

7. Create RDS for Database

- Engine: `MariaDB`
- Name: `myDB`
- VPC: `myVPC`
- Availability zone: `us-east-1b`
- Set up EC2 connection with `myServer`

8. Launch EC2 instance and connect to RDS endpoint

- Connect to rds using the following command:
  `mysql -h <rds_endpoint> -u admin -p`
- Create a database 'shop' inside the database
- Transfer your sql dump file to the current directory
- Import the database using the following command
  `mysql -h <rds_endpoint> -u admin -p shop < shopdb.sql`

9. Install apache server and move the backend file

```
- sudo apt update
  sudo apt install apache2

  sudo systemctl start apache2
  sudo systemctl enable apache2

  sudo mv server.js /var/www/html/
```

10. Install the required tools and libraries

```
  sudo apt install nodejs
  sudo apt install npm

  sudo npm init -y
  sudo npm install express cors mysql2
```

11. Make changes within server.js with database endpoint details

```
const con = mysql.createConnection({
host: "<rds_endpoint>",
user: "<username>",
password: "<password>",
database: "shop",
});
```

Start the server with the following command:
`sudo node server.js`

12. Update the script.js in the frontend with the public IP of EC2

13. Add a security group inbound rule in the EC2 instance with the port 5000
