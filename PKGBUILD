# Maintainer: Faezix <faezix@github.com>
pkgname=yt-transcriber
pkgver=0.0.0
pkgrel=1
pkgdesc="CLI tool to extract YouTube video transcripts with timestamps"
arch=('x86_64' 'aarch64')
url="https://github.com/Faeziix/yt-transcriber"
license=('MIT')
depends=('yt-dlp')
makedepends=('rust' 'cargo')
options=('!debug')
install=$pkgname.install

source=()
sha256sums=()

build() {
    cd "$startdir"
    cargo build --release --locked
}

package() {
    cd "$startdir"

    install -Dm755 "target/release/$pkgname" "$pkgdir/usr/bin/$pkgname"

    if [ -f "LICENSE" ]; then
        install -Dm644 "LICENSE" "$pkgdir/usr/share/licenses/$pkgname/LICENSE"
    fi
}
