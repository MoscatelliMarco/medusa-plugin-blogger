import TagItem from "./tag";

const UploadArticleItem = (props) => {
    return (
        <div>
            <div className={`slide overflow-hidden ${props.show_upload ? "active" : ""}`}>
                <div className="slide-inside w-full p-4">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                        <input type="text" className='border h-fit focus:outline-none border-gray-200 bg-transparent text-gray-500 px-5 py-2 rounded-full' placeholder='Author' />
                        <TagItem />
                        <input placeholder='url-slug' type="text" className='border h-fit focus:outline-none border-gray-200 bg-transparent text-gray-500 px-5 py-2 rounded-full' />
                        <input placeholder='SEO title' type="text" className='border h-fit focus:outline-none border-gray-200 bg-transparent text-gray-500 px-5 py-2 rounded-full' />
                        <textarea placeholder='SEO description' className='border h-fit focus:outline-none border-gray-200 bg-transparent text-gray-500 px-5 py-2 rounded-full'></textarea>
                        <input placeholder='SEO keywords' type="text" className='border h-fit focus:outline-none border-gray-200 bg-transparent text-gray-500 px-5 py-2 rounded-full' />
                    </div>
                </div>
            </div>
            <style>
                {
                    `
                        .slide {
                            height: 0px;
                            transition: height 0.3s ease-in-out;
                             
                        }
                        .slide.active {
                            height: 250px;
                        }
                        .slide-inside {
                            height: 250px;
                        }
                    `
                }
            </style>
        </div>
    )
}

export default UploadArticleItem;