# 何に使う？

Denoで作成したHTTPローカルサーバーです。<br>
Windowsでしか動作確認していませんが、OS依存の処理は無いはずです。

# 特徴

## 複数のディレクトリを扱えます。
例えば、

| ディレクトリ名 | 格納しているディレクトリ・ファイル |
|---|---|
| mock | APIへのアクセスや解析タグに関する関数を、何もしないように変更したディレクトリ・ファイル |
| mod | 改修対象のディレクトリ・ファイル |
| base | 現本番のディレクトリ・ファイル |
```
www/
  │ 
  ├─ mock/
      └─ common/
           └─ js/
               └─ fetch.js
  │ 
  └─ mod/
       └─ index.html
  │ 
  └─ base/
      └─ common/
           ├─ css/
               └─ style.css
           └─ js/
               └─ fetch.js
      └─ index.html
```
という構成にします。<br>
その後、mock,mod,baseの順番にファイル探索するよう設定します。
最後に、このローカルサーバーを起動してブラウザでアクセスすると、ページで使用される各ファイルは以下のように取得されます。

| URL | レスポンスで返されるファイルの格納先 |
|---|---|
| `http://localhost:8000/common/js/fetch.js` | mock |
| `http://localhost:8000/index.html` | mod |
| `http://localhost:8000/common/css/style.css` | base |

利点として、改修作業中に別プロジェクトの本番リリースが入り、その反映を取り込まなければならない場合でも、何も考えずbaseにリリースされたファイルを含む一式を入れて、全部上書きすれば反映を取り込むことができます。
また、ディレクトリが分かれているので、modにある改修部分だけをgit管理することも可能です。

## カスタムヘッダでファイル格納先のディレクトリ名を確認できます。

上記の例でいうと以下のようになります。
| URL | Customized-Source-Directory |
|---|---|
| `http://localhost:8000/common/js/fetch.js` | www/mock |
| `http://localhost:8000/index.html` | www/mod |
| `http://localhost:8000/common/css/style.css` | www/base |

# 使い方

以下では、上記の「mock」、「mod」、「base」などのファイルを探索する際の相対ルートとなるディレクトリを「ターゲットディレクトリ」と呼ぶことにします。

Denoをインストールしていない人は[Denoの公式サイト](https://deno.com/)からダウンロード・インストール・エディタへの設定を完了してください

## 1. ローカルにツールを配置
このリポジトリを適当なディレクトリにクローンしてください
## 2. ターゲットディレクトリを設定する
このツールは
- .envに記述
- ツール実行時の引数
の2通りの方法でファイルを探索するディレクトリを設定できます。<br>
.envに「mock」、「mod」、「base」の順番で探索するようにターゲットディレクトリを設定する場合は、以下のように記載します。
```Dotenv
TARGET_DIRECTORY=mock,base,mod
```
引数に設定する際はtask名の後に
```
--targetDirectories=mock,base,mod
```
を渡します。
## 3. ツールを実行
CLIで
```
deno task start
```
を実行してください。
```
Each directory is used as the root and files are searched for in the following order:
C:\dummyPath\www\00
C:\dummyPath\www\01

Listening on http://[::1]:8000/
```
と表示されたらサーバーの起動が完了しています。<br>
※ 2行目以降の絶対パスはターゲットディレクトリの絶対パスが出力されます。
## 4. ブラウザでアクセス
適当なindex.htmlファイルをターゲットディレクトリのいずれかに格納して、
ブラウザで「`http://localhost:8000`」にアクセスしてファイルが正常に表示されたらOKです。

# 注意点

- 文字コードはUTF-8のみに対応していると思います。Shift-JIS、EUC-JPだと文字化けします。
- ツールを実行時、`Listening on http://localhost:8000/`と表示されてほしいのですが、`Listening on http://[::1]:8000/`となります。
- 現状だと、port番号は8000に固定です。
