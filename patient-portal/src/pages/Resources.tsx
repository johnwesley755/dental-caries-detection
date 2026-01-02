// patient-portal/src/pages/Resources.tsx
import React, { useEffect, useState } from 'react';
import { BookOpen, Video, FileText, ExternalLink, Loader2, Search } from 'lucide-react';
import { resourceService, Resource } from '../services/resourceService';
import { toast } from 'sonner';

export const Resources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadResources();
  }, [selectedCategory, searchQuery]);

  const loadCategories = async () => {
    try {
      const cats = await resourceService.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await resourceService.getResources({
        category: selectedCategory || undefined,
        search: searchQuery || undefined,
      });
      setResources(data);
    } catch (error) {
      console.error('Failed to load resources:', error);
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return Video;
      case 'guide':
        return BookOpen;
      default:
        return FileText;
    }
  };

  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resources</h1>
        <p className="text-gray-600">Educational materials to help you maintain optimal oral health</p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      {Object.keys(groupedResources).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedResources).map(([category, categoryResources]) => {
            const Icon = getTypeIcon(categoryResources[0]?.type || 'article');
            return (
              <div key={category}>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{category}</h2>
                  <span className="text-sm text-gray-500">({categoryResources.length})</span>
                </div>

                {/* Category Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryResources.map((resource) => {
                    const TypeIcon = getTypeIcon(resource.type);
                    return (
                      <a
                        key={resource.id}
                        href={resource.url || '#'}
                        target={resource.url ? '_blank' : undefined}
                        rel={resource.url ? 'noopener noreferrer' : undefined}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all group"
                      >
                        {/* Featured Badge */}
                        {resource.is_featured && (
                          <div className="mb-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          </div>
                        )}

                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {resource.title}
                            </h3>
                          </div>
                          {resource.url && (
                            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
                          )}
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                          {resource.description}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{resource.source || resource.author}</span>
                          <span>{resource.view_count} views</span>
                        </div>

                        {/* Tags */}
                        {resource.tags && resource.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {resource.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Resources Found</h3>
          <p className="text-gray-600">
            {searchQuery || selectedCategory
              ? 'Try adjusting your filters'
              : 'No educational resources available at this time'}
          </p>
        </div>
      )}
    </div>
  );
};
