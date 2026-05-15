from fastapi import FastAPI

app = FastAPI(title="AI Vaidya Backend")


@app.get("/")
async def health():
    return {"status": "ok", "service": "AI Vaidya backend"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
