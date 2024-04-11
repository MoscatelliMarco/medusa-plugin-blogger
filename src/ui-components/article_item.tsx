import React from "react"

const ArticleItem = (props) => {
    return (
        <div className="flex flex-col gap-1 p-2.5 bg-white rounded">
            <div className="overflow-hidden rounded h-48 w-full mb-2.5">
                <div className="w-full h-full bg-red-300"></div>
            </div>
            <h3 className="text-lg font-medium">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</h3>
            <p className="text-sm text-gray-800">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur facere, odio sunt illo mollitia, consequatur nam iusto nulla quis amet maxime et at? Rem quam, tempora nam dolores autem totam?</p>
            <div className="flex flex-wrap gap-1 mt-3">
                <span className="bg-blue-300 text-white text-sm px-1.5 py-0.5 rounded-lg">Money</span>
                <span className="bg-blue-300 text-white text-sm px-1.5 py-0.5 rounded-lg">Product</span>
                <span className="bg-blue-300 text-white text-sm px-1.5 py-0.5 rounded-lg">Health</span>
                <span className="bg-blue-300 text-white text-sm px-1.5 py-0.5 rounded-lg">Cities</span>
                <span className="bg-blue-300 text-white text-sm px-1.5 py-0.5 rounded-lg">Travel</span>
            </div>
        </div>
    )
}

export default ArticleItem;