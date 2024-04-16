import { useEffect, useRef } from "react"
import Tagify from '@yaireo/tagify'
import DragSort from "@yaireo/dragsort"
import TagStyle from '../css/tag_style'
import { Input } from "@medusajs/ui"

const TagItem = () => {
    const tagRef = useRef(null);
    useEffect(() => {
        // Tags logic
        const tagify = new Tagify(tagRef.current, {
            maxTags: 5
        })
        new DragSort(tagify.DOM.scope, {
            selector:'.'+tagify.settings.classNames.tag,
            callbacks: {
                dragEnd: onDragEnd
            }
        })
        function onDragEnd(elm){
            tagify.updateValueByDOMTags()
        }
    }, [])

    return (
        <div>
            <TagStyle />
            <Input ref={tagRef} id="tags" name="tags" className="h-fit py-0 px-0" placeholder="Tags"/>
            <style>
                {
                    `
                    .tagify__input {
                        margin: 4px 1px;
                    }
                    .tagify__tag {
                        margin: 3px 5px;
                    }
                    .tagify {
                        border: none;
                    }
                    `
                }
            </style>
        </div>
    )
}

export default TagItem;