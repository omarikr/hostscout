'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Tag } from 'lucide-react';

interface SearchBarProps {
  tags: { id: number; name: string }[];
  currentSearch?: string;
  currentTag?: string;
}

export default function SearchBar({ tags, currentSearch, currentTag }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(currentSearch || '');
  const [selectedTag, setSelectedTag] = useState(currentTag || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedTag) params.set('tag', selectedTag);
    router.push(`/?${params.toString()}`);
  };

  const handleTagFilter = (tagId: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (tagId) params.set('tag', tagId);
    router.push(`/?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTag('');
    router.push('/');
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hosts by name..."
              className="pl-10"
            />
          </div>
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          {(searchQuery || selectedTag) && (
            <Button type="button" variant="outline" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </form>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-muted-foreground mr-2 flex items-center gap-1">
            <Tag className="h-4 w-4" />
            Filter by tag:
          </span>
          <Button
            variant={!selectedTag ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTagFilter('')}
          >
            All
          </Button>
          {tags.map((tag) => (
            <Button
              key={tag.id}
              variant={selectedTag === String(tag.id) ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTagFilter(String(tag.id))}
            >
              {tag.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
