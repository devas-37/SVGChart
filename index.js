


let data = []
let labels=['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr']
let legend_name=['UZS','WMR','WMZ','RUB','CND','YUAN','SO`M','ALIENWARE']
for (let i = 0; i < 5; i++) {
    let _=[]
    let rr=Math.random()*200+100
    for(let j=0;j<12;j++){
        _.push(Math.round(Math.random()*rr))
    }

    data.push(
        {
            data:_,
            label:legend_name[i]
        }
    )
}

let m = new SVGChart('app',{
    width: 1200,
    height: 600,
    data:data,
    type:'spline',
    point:true,
    title:'Valyutalar dinamikasi',
    animation:false,
    label:labels,
    bgColor:'#021b30'
})