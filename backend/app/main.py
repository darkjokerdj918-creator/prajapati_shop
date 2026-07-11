"""
FastAPI application entry point.
Wires up middleware, routes, startup/shutdown events, and serves static files.
"""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.core.config import settings
from app.core.database import create_tables
from app.api.v1.router import api_router
from app.seed_data import seed


# ── Lifespan: startup + shutdown ──────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("[Start] Prajapati Store API starting up...")
    create_tables()
    seed()
    yield
    # Shutdown
    print("[Shutdown] Prajapati Store API shutting down...")


# ── App instance ───────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "## 🏺 Prajapati Store REST API\n\n"
        "Full e-commerce backend for pottery products.\n\n"
        "### Features\n"
        "- **Products** — list, filter, search, featured\n"
        "- **Auth** — JWT register/login\n"
        "- **Cart** — guest & user sessions\n"
        "- **Orders** — checkout, history\n"
        "- **Newsletter & Contact** — subscribe, send message\n"
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── CORS Middleware ────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── API routes ─────────────────────────────────────────────
app.include_router(api_router)

# ── Serve admin static files ───────────────────────────────
ADMIN_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "prajapati", "admin"))
if not os.path.isdir(ADMIN_DIR):
    if os.path.isdir("/prajapati/admin"):
        ADMIN_DIR = "/prajapati/admin"

if os.path.isdir(ADMIN_DIR):
    app.mount("/prajapati/admin", StaticFiles(directory=ADMIN_DIR, html=True), name="admin")

# ── Serve frontend static files ────────────────────────────
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "frontend")

if os.path.isdir(FRONTEND_DIR):
    # Serve images, css, js
    app.mount("/images", StaticFiles(directory=os.path.join(FRONTEND_DIR, "images")), name="images")
    app.mount("/css", StaticFiles(directory=os.path.join(FRONTEND_DIR, "css")), name="css")
    app.mount("/js", StaticFiles(directory=os.path.join(FRONTEND_DIR, "js")), name="js")

    @app.get("/", include_in_schema=False)
    async def serve_index():
        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

    @app.get("/login", include_in_schema=False)
    @app.get("/login.html", include_in_schema=False)
    async def serve_login():
        return FileResponse(os.path.join(FRONTEND_DIR, "pages", "login.html"))

    @app.get("/orders", include_in_schema=False)
    @app.get("/orders.html", include_in_schema=False)
    async def serve_orders():
        return FileResponse(os.path.join(FRONTEND_DIR, "pages", "orders.html"))

    @app.get("/profile", include_in_schema=False)
    @app.get("/profile.html", include_in_schema=False)
    async def serve_profile():
        return FileResponse(os.path.join(FRONTEND_DIR, "pages", "profile.html"))

    @app.get("/ganesha", include_in_schema=False)
    @app.get("/ganesha.html", include_in_schema=False)
    async def serve_ganesha():
        return FileResponse(os.path.join(FRONTEND_DIR, "pages", "ganesha.html"))

    @app.get("/household", include_in_schema=False)
    @app.get("/household.html", include_in_schema=False)
    async def serve_household():
        return FileResponse(os.path.join(FRONTEND_DIR, "pages", "household.html"))

# ── Health check ───────────────────────────────────────────
@app.get("/health", tags=["System"])
async def health():
    return {"status": "healthy", "app": settings.APP_NAME, "version": settings.APP_VERSION}
