import { useEffect, useRef } from "react"
import Tagify from '@yaireo/tagify'
import DragSort from "@yaireo/dragsort"
import TagStyle from '../css/tag_style'

const TagItem = () => {
    const tagRef = useRef(null);
    useEffect(() => {
        // Tags logic
        const tagify = new Tagify(tagRef.current, {})
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
            <input ref={tagRef} id="tags" name="tags" className="bg-transparent h-fit focus:outline-none border border-gray-200 font-medium w-full px-5 py-2 rounded-full" placeholder="Tags"/>
        </div>
    )
}

export default TagItem;