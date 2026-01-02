# backend/app/api/v1/resources.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models import User
from app.models.resource import Resource
from pydantic import BaseModel

router = APIRouter(tags=["resources"])

# Schemas
class ResourceResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    content: Optional[str]
    category: str
    type: str
    url: Optional[str]
    thumbnail_url: Optional[str]
    author: Optional[str]
    source: Optional[str]
    tags: Optional[List[str]]
    is_featured: bool
    view_count: int
    created_at: datetime

    class Config:
        from_attributes = True

# Endpoints
@router.get("/resources", response_model=List[ResourceResponse])
async def get_resources(
    category: Optional[str] = None,
    type: Optional[str] = None,
    search: Optional[str] = None,
    featured_only: bool = False,
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get educational resources with optional filters"""
    query = db.query(Resource)
    
    # Filter by category
    if category:
        query = query.filter(Resource.category == category)
    
    # Filter by type
    if type:
        query = query.filter(Resource.type == type)
    
    # Search in title and description
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Resource.title.ilike(search_pattern),
                Resource.description.ilike(search_pattern),
                Resource.content.ilike(search_pattern)
            )
        )
    
    # Filter featured only
    if featured_only:
        query = query.filter(Resource.is_featured == True)
    
    # Order by featured first, then by creation date
    resources = query.order_by(
        Resource.is_featured.desc(),
        Resource.created_at.desc()
    ).limit(limit).all()
    
    # Convert to response format
    return [
        {
            "id": str(r.id),
            "title": r.title,
            "description": r.description,
            "content": r.content,
            "category": r.category,
            "type": r.type,
            "url": r.url,
            "thumbnail_url": r.thumbnail_url,
            "author": r.author,
            "source": r.source,
            "tags": r.tags,
            "is_featured": r.is_featured,
            "view_count": r.view_count,
            "created_at": r.created_at
        }
        for r in resources
    ]

@router.get("/resources/{resource_id}", response_model=ResourceResponse)
async def get_resource(
    resource_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific resource by ID"""
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    # Increment view count
    resource.view_count += 1
    db.commit()
    
    return {
        "id": str(resource.id),
        "title": resource.title,
        "description": resource.description,
        "content": resource.content,
        "category": resource.category,
        "type": resource.type,
        "url": resource.url,
        "thumbnail_url": resource.thumbnail_url,
        "author": resource.author,
        "source": resource.source,
        "tags": resource.tags,
        "is_featured": resource.is_featured,
        "view_count": resource.view_count,
        "created_at": resource.created_at
    }

@router.get("/resources/categories/list")
async def get_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get list of available resource categories"""
    categories = db.query(Resource.category).distinct().all()
    return [cat[0] for cat in categories]
