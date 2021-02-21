
const url = "/photos/cat-image_500x300xcover.jpg"
export const cfResponse = {
  "Records": [
    {
      "cf": {
        "request": {
          "origin": {
            "s3": {
              "authMethod": "none",
              "customHeaders": {},
              "domainName": "demo-cf-image-resize.s3-ap-southeast-1.amazonaws.com",
              "path": "",
              "region": "ap-souteast-1"
            }
          },
          "querystring": "",
          "uri": url
        },
        "response": {
          "header": {},
          "status": "403",
          "statusDescription": "Forbidden"
        }
      }
    }
  ]
}
