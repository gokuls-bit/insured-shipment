{
  "info": {
    "name": "SurakshitSafar API",
    "description": "Complete API collection for Shipment Insurance Platform",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000/api/v1",
      "type": "string"
    },
    {
      "key": "access_token",
      "value": "",
      "type": "string"
    }
  ],
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{access_token}}",
        "type": "string"
      }
    ]
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "auth": {
          "type": "noauth"
        },
        "method": "GET",
        "header": [],
        "url": "{{base_url}}/health"
      }
    },
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "auth": {
              "type": "noauth"
            },
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"testuser\",\n  \"email\": \"test@example.com\",\n  \"password\": \"Test@123\"\n}"
            },
            "url": "{{base_url}}/auth/register"
          }
        },
        {
          "name": "Login",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    var jsonData = pm.response.json();",
                  "    pm.collectionVariables.set('access_token', jsonData.data.accessToken);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "auth": {
              "type": "noauth"
            },
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@shipment.com\",\n  \"password\": \"Admin@123\"\n}"
            },
            "url": "{{base_url}}/auth/login"
          }
        },
        {
          "name": "Get Current User",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{base_url}}/auth/me"
          }
        },
        {
          "name": "Logout",
          "request": {
            "method": "POST",
            "header": [],
            "url": "{{base_url}}/auth/logout"
          }
        }
      ]
    },
    {
      "name": "Companies",
      "item": [
        {
          "name": "Create Company",
          "request": {
            "auth": {
              "type": "noauth"
            },
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Test Insurance Co.\",\n  \"email\": \"info@testinsurance.com\",\n  \"website\": \"https://www.testinsurance.com\",\n  \"contact\": \"+91-555-9999\",\n  \"description\": \"Test insurance company\",\n  \"established\": 2020,\n  \"coverage\": \"Global\",\n  \"maxCoverageAmount\": 30,\n  \"maxCoverageCurrency\": \"USD\",\n  \"routes\": [\"Mumbai - Dubai\"],\n  \"cargoTypes\": [\"Electronics\"],\n  \"shipmentTypes\": [\"Ship\"],\n  \"submitterName\": \"John Doe\",\n  \"submitterEmail\": \"john@test.com\",\n  \"submitterPhone\": \"+91-555-9999\"\n}"
            },
            "url": "{{base_url}}/companies"
          }
        },
        {
          "name": "Get All Companies",
          "request": {
            "auth": {
              "type": "noauth"
            },
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/companies?page=1&limit=10",
              "host": ["{{base_url}}"],
              "path": ["companies"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "10"
                }
              ]
            }
          }
        },
        {
          "name": "Get Company by ID",
          "request": {
            "auth": {
              "type": "noauth"
            },
            "method": "GET",
            "header": [],
            "url": "{{base_url}}/companies/COMPANY_ID"
          }
        },
        {
          "name": "Approve Company",
          "request": {
            "method": "PUT",
            "header": [],
            "url": "{{base_url}}/companies/COMPANY_ID/approve"
          }
        },
        {
          "name": "Reject Company",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"rejectionReason\": \"Does not meet requirements\"\n}"
            },
            "url": "{{base_url}}/companies/COMPANY_ID/reject"
          }
        },
        {
          "name": "Delete Company",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": "{{base_url}}/companies/COMPANY_ID"
          }
        }
      ]
    },
    {
      "name": "Shipments",
      "item": [
        {
          "name": "Create Shipment",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"type\": \"Ship\",\n  \"origin\": {\n    \"country\": \"India\",\n    \"port\": \"Mumbai (JNPT)\"\n  },\n  \"destination\": {\n    \"country\": \"Singapore\",\n    \"port\": \"Singapore Port\"\n  },\n  \"companyId\": \"COMPANY_ID\",\n  \"cargoType\": \"Electronics\",\n  \"cargoDescription\": \"Consumer electronics\",\n  \"insuredAmount\": 500000,\n  \"currency\": \"USD\",\n  \"departureDate\": \"2025-11-01\",\n  \"arrivalDate\": \"2025-11-10\"\n}"
            },
            "url": "{{base_url}}/shipments"
          }
        },
        {
          "name": "Get All Shipments",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{base_url}}/shipments"
          }
        },
        {
          "name": "Get Shipment by ID",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{base_url}}/shipments/SHIPMENT_ID"
          }
        }
      ]
    },
    {
      "name": "Policies",
      "item": [
        {
          "name": "Create Policy",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"shipmentId\": \"SHIPMENT_ID\",\n  \"companyId\": \"COMPANY_ID\",\n  \"coverageAmount\": 500000,\n  \"premium\": 15000,\n  \"startDate\": \"2025-11-01\",\n  \"endDate\": \"2025-11-10\",\n  \"coverageType\": \"comprehensive\"\n}"
            },
            "url": "{{base_url}}/policies"
          }
        },
        {
          "name": "Get All Policies",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{base_url}}/policies"
          }
        },
        {
          "name": "Get Policy by ID",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{base_url}}/policies/POLICY_ID"
          }
        }
      ]
    },
    {
      "name": "Claims",
      "item": [
        {
          "name": "Submit Claim",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"policyId\": \"POLICY_ID\",\n  \"description\": \"Cargo was damaged during transit due to rough weather conditions. Estimated loss is significant.\",\n  \"claimAmount\": 100000,\n  \"currency\": \"USD\"\n}"
            },
            "url": "{{base_url}}/claims"
          }
        },
        {
          "name": "Get All Claims",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{base_url}}/claims"
          }
        },
        {
          "name": "Get Claim by ID",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{base_url}}/claims/CLAIM_ID"
          }
        },
        {
          "name": "Review Claim (Approve)",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": \"approved\",\n  \"resolutionNotes\": \"Claim approved after verification\",\n  \"paidAmount\": 100000\n}"
            },
            "url": "{{base_url}}/claims/CLAIM_ID/review"
          }
        },
        {
          "name": "Review Claim (Reject)",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": \"rejected\",\n  \"resolutionNotes\": \"Insufficient evidence provided\"\n}"
            },
            "url": "{{base_url}}/claims/CLAIM_ID/review"
          }
        }
      ]
    },
    {
      "name": "Admin",
      "item": [
        {
          "name": "Get Dashboard Stats",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{base_url}}/admin/dashboard/stats"
          }
        },
        {
          "name": "Get All Users",
          "request": {
            "method": "GET",
            "header": [],
            "url": "{{base_url}}/admin/users"
          }
        }
      ]
    }
  ]
}