import { useEffect, useRef } from "react"
import Tagify from '@yaireo/tagify'
import DragSort from "@yaireo/dragsort"
import TagStyle from '../css/tag_style'

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
            <input ref={tagRef} id="tags" name="tags" className="bg-transparent rounded-lg h-fit focus:outline-none font-medium w-full" placeholder="Tags"/>
        </div>
    )
}

export default TagItem;