// utils/swagger.js
// Simple API documentation without swagger-jsdoc dependency

const setupSwagger = (app) => {
  // Simple API documentation endpoint
  app.get('/api-docs', (req, res) => {
    res.json({
      openapi: '3.0.0',
      info: {
        title: 'SocialSync API',
        version: '1.0.0',
        description: 'API for cross-platform social media posting app',
      },
      servers: [
        {
          url: 'http://localhost:5000/api',
          description: 'Development server',
        },
      ],
      paths: {
        '/api/health': {
          get: {
            summary: 'Health check',
            responses: {
              '200': {
                description: 'Server is healthy',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        status: { type: 'string', example: 'ok' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        '/api/posts': {
          post: {
            summary: 'Create a new post',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      text: { type: 'string', example: 'Hello world!' },
                      imageUrl: { type: 'string', example: 'https://example.com/image.jpg' },
                      platforms: { 
                        type: 'array', 
                        items: { type: 'string' },
                        example: ['facebook', 'twitter']
                      }
                    },
                    required: ['text', 'platforms']
                  }
                }
              }
            },
            responses: {
              '200': {
                description: 'Post created successfully',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        platforms: { type: 'array', items: { type: 'string' } },
                        text: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  });
};

module.exports = setupSwagger;