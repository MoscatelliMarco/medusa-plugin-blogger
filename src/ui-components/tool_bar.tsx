import { Link } from "react-router-dom";
import { Button, Input, Container, Select } from "@medusajs/ui";
import {
    ArchiveBox,
    MagnifyingGlass,
    Funnel,
    TrianglesMini,
    Trash
} from "@medusajs/icons";
import { useState, useEffect, useRef } from "react";

const ToolBar = (props) => {
    const [ showMenu, setShowMenu ] = useState<boolean>(false);
    const [ contentMenu, setContentMenu ] = useState<"filter"| "sort" | null>(null);

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
            "label": "Created at",
            "value": "created_at"
        },
        {
            "label": "Updated at",
            "value": "updated_at"
        },
        {
            "label": "Draft",
            "value": "draft"
        }
    ])
    const filterOperations = useRef([
        {
            "label": "=",
            "value": "Equal"
        },
        {
            "label": ">",
            "value": "MoreThan"
        },
        {
            "label": "<",
            "value": "LessThan"
        },
        {
            "label": ">=",
            "value": "MoreThanOrEqual"
        },
        {
            "label": "<=",
            "value": "LessThanOrEqual"
        },
        {
            "label": "Like",
            "value": "Like"
        },
        {
            "label": "ILike",
            "value": "ILike"
        },
    ])

    const [ sort, setSort ] = useState({
        order_by: null,
        field: null
    })
    // This two function are needed because the Select component doesn't accept custom functions
    const changeOrderBy = (value) => setSort(sort => {return {...sort, order_by: value}});
    const changeField = (value) => setSort(sort => {return {...sort, field: value}});
    useEffect(() => {
        if (sort.order_by && sort.field) {
            props.setFiltersSort(filter_sort => {
                return {
                    ...filter_sort, 
                    order: {
                        [sort.field]: sort["order_by"]
                    }
                }
            })
        }
    }, [JSON.stringify(sort)])

    const [ filters, setFilters ] = useState([]);
    const next_filter_id = useRef(1);
    function newFilter() {
        setFilters(filters => {
            return [
                ...filters, {
                    id: next_filter_id.current,
                    field: "",
                    operation: "",
                    value: ""
                }
            ]
        })
    }
    useEffect(() => {
        next_filter_id.current += 1;
    }, [filters.length])
    function setValueFilter(input_value) {
        const [ value, id, type ] = input_value.split("---");
        setFilters(filters_element => filters_element.map(filter => 
            filter.id == id ? {...filter, [type == "columns" ? "field" : "operation"]: value } : filter
        ));
    }
    const [ inputTimeout, setInputTimeout ] = useState<NodeJS.Timeout | null>(null);
    function setInputValueFilter(event) {
        if (inputTimeout) {
            clearTimeout(inputTimeout);
        }

        const newTimeout = setTimeout(() => {
            setFilters(filters_element => filters_element.map(filter => 
                filter.id == event.target.dataset.id ? {...filter, value: event.target.value} : filter
            ));
        }, 1500)

        setInputTimeout(newTimeout);
    }
    function setDeleteFilter(event) {
        setFilters(filters => {
            return filters.filter(filter => filter.id != event.target.dataset.id)
        })
    }
    useEffect(() => {
        const where_object = {};

        for (let filter of filters) {
            if (filter.field && filter.operation && filter.value) {
                let value_to_add;
                if (filter.operation != "Equal") {
                    value_to_add = {
                        find_operator: filter.operation,
                        value: filter.value
                    }
                } else {
                    value_to_add = filter.value;
                }
                if (where_object[filter.field]) {
                    if (Array.isArray(where_object[filter.field])) {
                        where_object[filter.field] = [
                            ...where_object[filter.field], 
                            value_to_add
                        ]
                    } else {
                        where_object[filter.field] = [
                            where_object[filter.field], 
                            value_to_add
                        ]
                    }
                } else {
                    where_object[filter.field] = value_to_add;
                }
            }
        }
        props.setFiltersSort(filters_sort => {
            return {
                ...filters_sort,
                where: where_object
            }
        });
    }, [JSON.stringify(filters)])

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
                                <Button onClick={newFilter} size="small" className="px-3">
                                    Add a filter
                                </Button>
                                <div className="flex flex-col gap-2">
                                    {
                                        filters.map(filter => {
                                            return (
                                                <div key={filter.id} className="flex items-center gap-4 w-full">
                                                    <div className="grid grid-cols-5 gap-4 w-full">
                                                        <div className="col-span-2">
                                                            <Select onValueChange={setValueFilter}>
                                                                <Select.Trigger>
                                                                    <Select.Value placeholder="Select a column to filter" />
                                                                </Select.Trigger>
                                                                <Select.Content>
                                                                    {columns.current.map((item) => (
                                                                        <Select.Item key={item.value} value={item.value + "---" + filter.id + "---" + "columns"}>
                                                                            {item.label}
                                                                        </Select.Item>
                                                                    ))}
                                                                </Select.Content>
                                                            </Select>
                                                        </div>
                                                        <div className="col-span-1">
                                                            <Select onValueChange={setValueFilter}>
                                                                <Select.Trigger>
                                                                    <Select.Value placeholder="Operation" />
                                                                </Select.Trigger>
                                                                <Select.Content>
                                                                    {filterOperations.current.map((item) => (
                                                                        <Select.Item key={item.value} value={item.value + "---" + filter.id + "---" + "operation"}>
                                                                            {item.label}
                                                                        </Select.Item>
                                                                    ))}
                                                                </Select.Content>
                                                            </Select>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <input onChange={setInputValueFilter} data-id={filter.id} className="caret-ui-fg-base bg-ui-bg-field hover:bg-ui-bg-field-hover shadow-borders-base placeholder-ui-fg-muted text-ui-fg-base transition-fg relative w-full appearance-none rounded-md outline-none focus-visible:shadow-borders-interactive-with-active disabled:text-ui-fg-disabled disabled:!bg-ui-bg-disabled disabled:placeholder-ui-fg-disabled disabled:cursor-not-allowed aria-[invalid=true]:!shadow-borders-error invalid:!shadow-borders-error [&amp;::--webkit-search-cancel-button]:hidden [&amp;::-webkit-search-cancel-button]:hidden [&amp;::-webkit-search-decoration]:hidden txt-compact-small h-8 px-2 py-1.5" placeholder="Value to filter"></input>
                                                        </div>
                                                    </div>
                                                    <Button onClick={setDeleteFilter} data-id={filter.id} variant="danger" className="p-1">
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
                                <Select onValueChange={changeField}>
                                    <Select.Trigger>
                                        <Select.Value placeholder="Select a field to sort" />
                                    </Select.Trigger>
                                    <Select.Content>
                                        {columns.current.map((item) => (
                                            <Select.Item key={item.value} value={item.value}>
                                                {item.label}
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select>
                                <Select onValueChange={changeOrderBy}>
                                    <Select.Trigger>
                                        <Select.Value placeholder="Select an order to sort" />
                                    </Select.Trigger>
                                    <Select.Content>
                                        {sortTypes.current.map((item) => (
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