provider "aws" {
  region     = "us-east-1"
  access_key = ""
  secret_key = ""
}

# 1 Create a VPC

resource "aws_vpc" "prod-vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "production"
  }
}

# 2 Create a Internet-Gateway

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.prod-vpc.id
}

# 3 Create a custom route table

resource "aws_route_table" "prod-route-table" {
  vpc_id = aws_vpc.prod-vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  route {
    ipv6_cidr_block = "::/0"
    gateway_id      = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "prod"
  }
}

# 4 Create a subnet

resource "aws_subnet" "subent-1" {
  vpc_id            = aws_vpc.prod-vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "prod-subnet"
  }
}

# 5 allocate subent with route table 

resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.subent-1.id
  route_table_id = aws_route_table.prod-route-table.id

}

# 6  Create Security Group to allow port 22,80,443

resource "aws_security_group" "allow_web" {
  name        = "allow_web_traffic"
  description = "Allow TLS inbound traffic"
  vpc_id      = aws_vpc.prod-vpc.id

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name = "allow_WEB"
  }
}

# 7 crate a network insterface with an ip in the subnet that was created in step 4  

resource "aws_network_interface" "web-server-nic" {
  subnet_id       = aws_subnet.subent-1.id
  private_ips     = ["10.0.1.50"]
  security_groups = [aws_security_group.allow_web.id]

}

# 8 Assign a elastic ip to network interface crated in step 7

resource "aws_eip" "one" {
  vpc                       = true
  network_interface         = aws_network_interface.web-server-nic.id
  associate_with_private_ip = "10.0.1.50"
  depends_on                = [aws_internet_gateway.gw, aws_instance.web-server-instance]
}

# 9 create a ubuntu server and install / enable apache2

resource "aws_instance" "web-server-instance" {
  ami               = "ami-09d56f8956ab235b3"
  instance_type     = "t2.micro"
  availability_zone = "us-east-1a"
  key_name          = "main-key"

  network_interface {
    device_index         = 0
    network_interface_id = aws_network_interface.web-server-nic.id
  }

  user_data = <<-EOF
                            #!/bin/bash
                            cd /home/ubuntu
                            sudo apt update -y
                            sudo apt install docker.io -y
                            sudo usermod -aG docker ubuntu
                            sudo apt install docker-compose -y
                            git clone https://github.com/Mahesh-Kasabe/Lets-Meet-Devops.git
                            cd Lets-Meet-Devops/
                            sudo docker-compose up -d
                            EOF
  tags = {
    Name = "web-server"
  }
}