   from langflow import create_app
   from fastapi.middleware.cors import CORSMiddleware

   app = create_app()

   # Add CORS middleware
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://ai-negoagent.netlify.app"],  # Your Netlify URL
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )

   if __name__ == "__main__":
       import uvicorn
       uvicorn.run(app, host="0.0.0.0", port=8000)
