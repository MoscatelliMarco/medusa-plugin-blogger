const ArticleEditorPage = () => {
  return (
    <div className="flex flex-col gap-4">

        <h1 className="text-3xl font-semibold text-gray-700 mb-3">Blog editor</h1>

        <div className="flex flex-col">
            <label htmlFor="title" className="font-medium text-gray-700 mr-1">Title</label>
            <input name="title" id="title" type="text" className="bg-transparent focus:outline-none border border-gray-300 text-lg font-medium w-full px-3 py-2 rounded" placeholder="Title" />
        </div>
        <div className="flex flex-col">
            <label htmlFor="description" className="font-medium text-gray-700 mr-1">Description</label>
            <textarea name="description" id="description" className="bg-transparent focus:outline-none h-24 border border-gray-300 w-full px-3 py-1.5 rounded" placeholder="Description"></textarea>
        </div>
        <div className="w-full h-[1px] bg-gray-300 mt-3 mb-1.5"></div>
        <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
                <label htmlFor="author" className="font-medium text-gray-700 mr-1">Author</label> 
                <input name="author" id="author" type="text" className="bg-transparent focus:outline-none border border-gray-300 w-full px-3 py-1.5 rounded" placeholder="Author" />
            </div>
            <div className="flex flex-col">
                <label htmlFor="tags" className="font-medium text-gray-700 mr-1">Tags</label> 
                <input name="tags" id="tags" type="text" className="bg-transparent focus:outline-none border border-gray-300 font-medium w-full px-3 py-1.5 rounded" placeholder="Tags" />
            </div>
        </div>
        <div className="w-full h-[1px] bg-gray-300 mt-4 mb-2.5"></div>
        <div className="flex flex-col">
            <label htmlFor="body" className="font-medium text-gray-700 mr-1">Body</label>
            <input name="body" id="body" type="text" className="bg-transparent focus:outline-none border border-gray-300 w-full px-3 py-1.5 rounded" placeholder="Title" />
        </div>

    </div>
  )
}
export default ArticleEditorPage;