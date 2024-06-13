import { Link } from "react-router-dom";
import { Button, Input, Container, Select } from "@medusajs/ui";
import {
    ArchiveBox,
    MagnifyingGlass,
    Funnel,
    TrianglesMini,
    Trash
} from "@medusajs/icons";
import { useState, useRef } from "react";

const ToolBar = () => {
    const [ showMenu, setShowMenu ] = useState<boolean>(false);
    const [ contentMenu, setContentMenu ] = useState<"filter"| "sort" | null>(null);
    const [ filters, setFilters ] = useState([]);

    const sortTypes = useRef([
        {
            label: "Ascending",
            value: "ASC"
        },
        {
            label: "Descending",
            value: "DESC"
        }
    ])
    const columns = useRef([
        {
            "label": "Author",
            "value": "author"
        },
        {
            "label": "Seo title",
            "value": "seo_title"
        },
        {
            "label": "Seo keywords",
            "value": "seo_keywords"
        },
        {
            "label": "Url slug",
            "value": "url_slug"
        },
        {
            "label": "Seo description",
            "value": "seo_description"
        },
        {
            "label": "Title",
            "value": "title"
        },
        {
            "label": "Subtitle",
            "value": "subtitle"
        },
        {
            "label": "Draft",
            "value": "draft"
        }
    ])
    const filterOperations = useRef([
        {
            "label": "=",
            "value": "equal"
        },
        {
            "label": ">",
            "value": "higher"
        },
        {
            "label": "<",
            "value": "lower"
        }
    ])

    return (
        <div className="flex flex-col w-full gap-2">
            <div className="flex justify-between items-center w-full">
                <Link to="/a/article-editor">
                    <Button variant="primary">
                        <ArchiveBox />
                        New article
                    </Button>
                </Link>
                <div className="flex items-center gap-2">
                    <Button onClick={() => {
                        if (contentMenu == "sort") {
                            setShowMenu(false);
                            setContentMenu(null);
                        } else {
                            setShowMenu(true);
                            setContentMenu("sort");
                        }
                    }} variant="secondary">
                        <TrianglesMini />
                        Sort by
                    </Button>
                    <Button onClick={() => {
                        if (contentMenu == "filter") {
                            setShowMenu(false);
                            setContentMenu(null);
                        } else {
                            setShowMenu(true);
                            setContentMenu("filter");
                        }
                    }} variant="secondary">
                        <Funnel />
                        Filter
                    </Button>
                    <div className="relative">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        {/* <input type="text" className="focus:outline-none border border-gray-300 rounded-md py-1.5 pr-4 pl-10 placeholder-gray-400" placeholder="Search" /> */}
                        <Input className="bg-white" type="search" />
                    </div>
                </div>
            </div>
            {
            showMenu ? 
                <Container className="flex justify-center">
                    {
                        contentMenu == "filter" ?
                        <div className="flex flex-col gap-2.5 w-full">
                            <p className="text-xl font-semibold">
                                Filter
                            </p>
                            <div className="flex flex-col gap-2">
                                <Button onClick={() => {
                                    setFilters(filters => {
                                        return [
                                            ...filters, {
                                                field: "",
                                                filterOperaion: ""
                                            }
                                        ]
                                    })
                                }} size="small" className="px-3">
                                    Add a filter
                                </Button>
                                <div className="flex flex-col gap-2">
                                    {
                                        filters.map(filter => {
                                            return (
                                                <div className="flex items-center gap-4 w-full">
                                                    <div className="grid grid-cols-5 gap-4 w-full">
                                                        <div className="col-span-2">
                                                            <Select>
                                                                <Select.Trigger>
                                                                    <Select.Value placeholder="Select a column to filter" />
                                                                </Select.Trigger>
                                                                <Select.Content>
                                                                    {columns.current.map((item) => (
                                                                        <Select.Item key={item.value} value={item.value}>
                                                                            {item.label}
                                                                        </Select.Item>
                                                                    ))}
                                                                </Select.Content>
                                                            </Select>
                                                        </div>
                                                        <div className="col-span-1">
                                                            <Select>
                                                                <Select.Trigger>
                                                                    <Select.Value placeholder="Operation" />
                                                                </Select.Trigger>
                                                                <Select.Content>
                                                                    {filterOperations.current.map((item) => (
                                                                        <Select.Item key={item.value} value={item.value}>
                                                                            {item.label}
                                                                        </Select.Item>
                                                                    ))}
                                                                </Select.Content>
                                                            </Select>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <Input placeholder="Value to filter"></Input>
                                                        </div>
                                                    </div>
                                                    <Button variant="danger" className="p-1">
                                                        <Trash />
                                                    </Button>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div> :
                        <div className="flex flex-col gap-2.5 w-full">
                            <p className="text-xl font-semibold">
                                Sort by
                            </p>
                            <div className="flex gap-4 items-center">
                                <Select>
                                    <Select.Trigger>
                                        <Select.Value placeholder="Select a field to sort" />
                                    </Select.Trigger>
                                    <Select.Content>
                                        {sortTypes.current.map((item) => (
                                            <Select.Item key={item.value} value={item.value}>
                                                {item.label}
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select>
                                <Select>
                                    <Select.Trigger>
                                        <Select.Value placeholder="Select a value to sort" />
                                    </Select.Trigger>
                                    <Select.Content>
                                        {columns.current.map((item) => (
                                            <Select.Item key={item.value} value={item.value}>
                                                {item.label}
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select>
                            </div>
                        </div>
                    }
                </Container> 
                : ""
            }
        </div>
    )
}

export default ToolBar;