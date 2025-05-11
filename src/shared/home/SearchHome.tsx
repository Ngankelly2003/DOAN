import React, { useState } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Search } = Input;

interface SearchComponentProps {
  className?: string;
}

const SearchHome: React.FC<SearchComponentProps> = ({ className }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (value: string) => {
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <Search
      placeholder="Tìm kiếm..."
      allowClear
      enterButton={<SearchOutlined />}
      size="large"
      className={className}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onSearch={handleSearch}
    />
  );
};

export default SearchHome;
