import { parseArgs } from "jsr:@std/cli@^1.0.12/parse-args"
import { serveDir } from "jsr:@std/http"
import * as path from "jsr:@std/path"
import "jsr:@std/dotenv/load"


// キャッシュを無効化
const headersOptionCaches:string[] = [
  "Cache-Control:no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma:no-cache",
  "Expires:0",
]

const getHeadersOptionCustomized = (dir:string):string[] =>{
  return [
    `Customized-Source-Directory:${dir}`
  ]
}

const dirctoriesFromArgs = parseArgs(Deno.args,{
  string:['targetDirectories'],
  default:{
    'targetDirectories': undefined,
  }
})['targetDirectories']?.split(',')

const targetDirctories = (()=>{
  let dir = Deno.env.get('TARGET_DIRECTORY')?.split(',') ?? ['']
  if(dirctoriesFromArgs?.every(elm => typeof elm === 'string' )){
    dir = dirctoriesFromArgs
  }
  return dir.map(elm => path.join('./www', elm))
})()

console.log(`Each directory is used as the root and files are searched for in the following order:\n${targetDirctories.map((dir)=>path.resolve(dir)).join('\n')}\n`)

Deno.serve({
  hostname:'localhost',
  port:8000
}, request => {
  const _pathname = new URL(request.url).pathname
  const pathname = _pathname.endsWith('/') ? `${_pathname}index.html` : _pathname
  let _fsRoot:string|null = null
  for( const dir of targetDirctories ){
    const rootRelativePath = path.join(dir, pathname)
    try{
      // 配列の順番に意味があり、途中でbreakする場合があるので同期で処理
      const fileInfo = Deno.statSync(rootRelativePath)
      if(fileInfo.isFile){
        _fsRoot = dir
        break
      }
    }catch(e){
      if(e instanceof Deno.errors.NotFound){
        continue
      }
    }
  }

  // 404のみ、直接Responseを返す
  if(_fsRoot === null){
    return new Response(
      null,
      {
        status:404,
        statusText:'Not Found',
      }
    )
  }

  return serveDir(request, {
    fsRoot: _fsRoot,
    urlRoot: "",
    headers: [
      ...headersOptionCaches,
      ...getHeadersOptionCustomized(_fsRoot.replaceAll('\\','/')),
    ],
  })
})