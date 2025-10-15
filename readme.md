 aws --endpoint-url=http://localhost:4566 dynamodb create-table     
 --table-name Usuarios     
 --key-schema AttributeName=login,KeyType=HASH     
 --attribute-definitions AttributeName=login,AttributeType=S     
 --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5     
 --endpoint-url=http://localhost:4566