import {Link} from 'react-router-dom';
import {signLanguages} from './dummyData'
import {Button} from '@/components/ui/button';

const LanguageCatalog = () => {

    return (
        <div className="full max-w-6xl m-auto flex flex-col gap-10">
            <h1 className='text-center text-3xl font-semibold px-2'>Choose Your Language</h1>
            <div className='flex flex-wrap justify-center gap-10 '>
                {
                    signLanguages.map((item, index) => {
                        return (
                            <Link
                                onClick={(e) => index !== 0 && e.preventDefault()}
                                to={`/catalog/${item.name}`}
                                className='w-full max-w-72 bg-main-color rounded-lg'
                            >
                                <Button
                                    className='min-h-28 justify-center gap-5 w-full  overflow-hidden relative flex cursor-pointer items-center p-5 px-5 border-black border-2'>
                                    <div>
                                    <img src={item.image} alt="" className=' w-20 h-20  border-[1px] border-black rounded-full'/>
                                    </div>
                                    <span className='font-semibold text-4xl'>{item.name}</span>
                                    {index !== 0 && (<div className="absolute inset-0 bg-black opacity-50"></div>)}
                                </Button>
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    )
}


export default LanguageCatalog;