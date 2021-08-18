function SVGChart(container, options) {
    let padding = {
        left: 60,
        top: 60,
        bottom: 60,
        right: options.width * 0.2
    }
    let cord = {
        x: padding.left,
        y: (options.height) - padding.bottom
    }
    let awidth = (options.width - (padding.left + padding.right))
    this.init(container, options, padding, cord, awidth);
}

SVGChart.prototype = (function() {
    let max_count = -1

    function round(float) {
        return Math.round(float)
    }

    function CNS(type) {
        return document.createElementNS("http://www.w3.org/2000/svg", type)
    }

    SVGElement.prototype.set = function(options = {}) {
        for (const [key, val] of Object.entries(options)) {
            this.setAttributeNS(null, key, val.toString())
                // this.setAttributeNS(null,'stroke-linejoin', 'round')
        }
    }
    HTMLElement.prototype.set = function(options = {}) {
        for (const [key, val] of Object.entries(options)) {
            this.setAttribute(key, val.toString())
        }
    }

    let Colors = ['#ffaa00', '#55aa00', '#00e5bf', '#e74aae', '#ff007f', '#5555ff', '#ff0000', '#00ff00', '#ebe066', '#ffaa00', '#55aa00', '#00e5bf', '#e74aae', '#ff007f', '#5555ff', '#ff0000', '#00ff00', '#ebe066']
    let Colors2 = ['#ff2566', '#00d7b1', '#ffc568', '#6663e1', '#009cf1', '#93b737']
    return {
        init(c, o, pad, cord, aw) {
            this.pad = pad
            this.cord = cord
            this.aw = aw
            this.w = o.width
            this.h = o.height
            this.parent = document.getElementById(c)
            this.svg = CNS('svg')
            this.data = o.data
            this.point = o.point
            this.svg.set({
                'x': 0,
                'y': 0,
                viewBox: `0 0 ${o.width} ${o.height}`,
                'fill': 'none',
                'width': this.w,
                'height': this.h,
            })
            let rect = CNS("rect")
            this.bg = o.bgColor
            rect.set({
                'fill': this.bg,
                'x': 0,
                'y': 0,
                'width': o.width,
                'height': o.height,
            })
            this.v_bufer = [] //Alohida ajratiluvchi chiziqlar id larini saqlab turish uchun
            this.label = o.label
            this.anim = o.animation
            this.svg.appendChild(rect)
            this.drawT(o.title, o.width / 2, this.pad.top / 2, 'silver', 'middle', 'middle', `font-size:${this.pad.top * 0.3}px`)
            this.parent.appendChild(this.svg)
            this.max = this.getMax(o.data)
            this.max = this.max + (10 - this.max % 10)
            this.data.forEach(e => {
                max_count = e.data.length > max_count ? e.data.length : max_count
            })
            this.drawBg()
            switch (o.type) {
                case 'line':
                    this.drawLine()
                    break
                case 'spline':
                    this.drawSpline()
                    break
            }

        },

        drawT(text, x, y, color, align, balign, style) {

            let t = CNS("text")
            t.set({ x: x, y: y, fill: color, 'alignment-baseline': balign, 'text-anchor': align, style: style })
            let m = document.createTextNode(text)
            t.appendChild(m)
            this.svg.appendChild(t)
        },
        drawC(x, y, r, c,cl) {
            let circle = CNS('circle')
            circle.set({
                'stroke': this.bg,
                'stroke-width': 5,
                'cx': round(x),
                'cy': round(y),
                'r': r,
                'fill': c,
            })
            if (cl) circle.set({class:cl})
            this.svg.appendChild(circle)
        },
        drawL(x1, y1, x2, y2, color, width) {
            let b = CNS('line')
            b.set({
                'stroke': color,
                'stroke-width': width,
                'x1': x1,
                'y1': y1,
                'x2': x2,
                'y2': y2,
                fill: 'none'
            })

            this.svg.appendChild(b)
        },
        getMax(data) {
            let buf = []
            data.forEach(e => {
                buf.push(...e.data)
            })
            console.log(Math.max(...buf))
            return Math.max(...buf)
        },
        drawBg() {
            let color = 'silver'

            let h = (this.h - (this.pad.bottom + this.pad.top)) / 5
            for (let i = 0; i < 6; i++) {
                let y = this.cord.y - i * h
                this.drawL(this.cord.x, y, this.cord.x + this.aw, y, '#003d47', 1)
                let tex = CNS('text')
                tex.set({
                    'x': this.cord.x - 5,
                    'y': y,
                    'fill': 'silver',
                    'text-anchor': 'end',
                    'alignment-baseline': 'middle'
                })
                let node = document.createTextNode((i * this.max / 5).toString())
                tex.appendChild(node)
                this.svg.appendChild(tex)
            }
            this.drawL(this.cord.x, this.pad.top - 10, this.cord.x, this.cord.y, color, 1)
            this.drawL(this.cord.x, this.cord.y, this.w - this.pad.right, this.cord.y, color, 1)
        },
        drawLegend(color) {
            let g = CNS('g')
            g.set({ transform: `translate(${this.cord.x + this.aw + 20},${this.h / 2 - this.data.length * 30 / 2})` })
            let h = 5;
            for (let i = 0; i < this.data.length; i++) {
                let gg = CNS('g')
                gg.set({ iden: this.data[i].label,id:'G'+this.data[i].label })
                gg.addEventListener('click', (e) => {
                    let id = e.target.parentNode.getAttribute('iden')
                    e.target.parentNode.set({x:10})
                    if (!this.v_bufer.includes(id)) this.v_bufer.push(id)
                    else
                        this.v_bufer = this.v_bufer.filter(e => e !== id)
                    this.data.forEach(e => {
                        document.getElementById(e.label).set({style:'opacity:0.1;stroke-width:1'})
                        document.getElementById('G'+e.label).set({style:'opacity:0.3'})
                        let circle=document.getElementsByClassName('C.'+e.label)
                        for (let [m,a] of Object.entries(circle))
                        a.style.opacity='0'
                    })
                    this.v_bufer.forEach(e => {
                        document.getElementById(e).set({style:'opacity:1;stroke-width:3'})
                        document.getElementById('G'+e).set({style:'opacity:1'})
                        let circle=document.getElementsByClassName('C.'+e)
                        for (let [m,a] of Object.entries(circle))
                        a.style.opacity='1'
                    })
                })
                let rec = CNS('rect')
                rec.set({ x: 0, y: h, width: 30, height: 15, fill: Colors[i] });
                gg.appendChild(rec)
                let t = CNS('text')
                let n = document.createTextNode(this.data[i].label)
                t.set({
                    x: 34,
                    y: h + 8,
                    'text-anchor': 'start',
                    'alignment-baseline': 'middle',
                    fill: 'silver',
                    style: 'font-size:12px'
                })
                t.appendChild(n)
                gg.appendChild(t)
                h += 25
                g.appendChild(gg)
            }

            this.svg.appendChild(g)
        },

        drawLabels() {
            let l = this.label
            let aw = Math.round(this.aw / max_count)
            let xx = this.cord.x + aw / 2
            for (let i = 0; i < max_count; i++) {
                this.drawT(l[i], xx + i * aw, this.cord.y + 14, 'silver', 'middle', '', 'font-size:12px')
            }
        },
        drawSpline() {
            this.data.forEach((el, index) => {
                let dif = this.cord.y - this.pad.top
                let pat = CNS('path')
                let aw = Math.round(this.aw / max_count)
                let xx = this.cord.x + aw / 2
                let d = `M${xx},${round(this.cord.y - (el.data[0]) / this.max * dif)} `
                let data = el.data
                for (let i = 0; i < el.data.length - 1; i++) {
                    let y = round(this.cord.y - data[i + 1] / this.max * dif)
                    let y1 = round(this.cord.y - data[i] / this.max * dif)
                    d += `C${xx + round(i * aw + aw / 2)},${y1} `
                    d += `${xx + round((i + 1) * aw - aw / 2)},${y} `
                    d += `${xx + round((i + 1) * aw)},${y}`
                        // this.drawL(this.cord.x + ((i ) * aw),this.cord.y,this.cord.x + ((i ) * aw),y1,'silver',0.5)
                        // this.drawL(this.cord.x + ((i+1 ) * aw),this.cord.y,this.cord.x + ((i +1) * aw),y,'silver',0.5)
                }
                pat.set({
                    'stroke': Colors[index],
                    'stroke-width': 1.5,
                    'd': d,
                    'class': this.anim ? 'path' : '',
                    id: el.label
                })
                if (this.anim) {
                    pat.style.strokeDasharray = pat.getTotalLength()
                    pat.style.strokeDashoffset = pat.getTotalLength()
                }
                this.svg.appendChild(pat)
                for (let i = 0; i < data.length && this.point; i++) {
                    this.drawC(xx + i * aw, this.cord.y - data[i] / this.max * dif, 5, Colors[index], 'C.'+el.label)
                }
            })
            this.drawLabels()
            this.drawLegend(Colors[0])
        },
        drawLine() {
            this.data.forEach((el, index) => {
                let pat = CNS('path')
                let aw = Math.round(this.aw / el.data.length)
                let d = `M${this.cord.x},${this.cord.y - el.data[0]} `
                let data = el.data
                for (let i = 0; i < data.length; i++) {
                    let y = this.cord.y
                    d += `L${this.cord.x + (i * aw)},${y - data[i]} `
                    this.drawL(this.cord.x + (i * aw), this.cord.y, this.cord.x + (i * aw), y - data[i], 'silver', 0.5)
                }
                pat.set({
                    'stroke': Colors[index],
                    'stroke-width': 2,
                    'd': d
                })
                this.svg.appendChild(pat)
            })
        }
    }
})()