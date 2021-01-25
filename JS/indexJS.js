
 const Items = Vue.createApp({
    data(){
        return{
            Ordenes:[],
            itemsTemp:[],
            ordenSeleccionada:false,
            ordenEditando:0,
            indexOrdenActiva:"",
            edicionPendiente:1,
            nuevoTotal:0,
        }
    },
    mounted(){
        fetch('https://eshop-deve.herokuapp.com/api/v2/orders',{
            method:'GET',
            headers:{"Authorization":"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwUGFINU55VXRxTUkzMDZtajdZVHdHV3JIZE81cWxmaCIsImlhdCI6MTYwNTY0NDA0NzA1OH0.skfIY_7CAANkxmhoq37OI4jYRE8flx1ENq1v1VaRevJiroYNFQYz7Oy6hL1YZ1OJkevXSQFuLMHTqY0w6d5nPQ"}
        }).then(response =>{
            return response.json();
        }).then(data => {
            data.orders.forEach(element => {
                element['mostrarFront'] = 1; 
                this.Ordenes.push(element);
            });
        })
    },
    methods:{
        expandirClick(event,index){
            if(this.indexOrdenActiva != index){
                this.itemsTemp=[];
                this.indexOrdenActiva=index;
                this.nuevoTotal=0;
                this.ordenEditando=this.Ordenes[index].number;
                this.edicionPendiente=1;
            }
            this.ordenSeleccionada=2;
            event.currentTarget.src="IMG/expandNaranja.png";
            if(this.Ordenes[index].mostrarFront==1){
                this.Ordenes[index].mostrarFront=2;
            }else{

                if(this.edicionPendiente!=2){this.Ordenes[index].mostrarFront=1;}
            }
        },
        expandirRelease(event,id){
            document.getElementById('expandir-'+id).src="IMG/expand.png"
        },
        insertarListaItems(event){
            let sku = document.getElementById('tempItem-sku');
            let name = document.getElementById('tempItem-nombre');
            let quantity = document.getElementById('tempItem-cantidad');
            let price = document.getElementById('tempItem-precio');

            this.nuevoTotal += parseInt(price.value);
            if(sku.value != "" && name.value != "" && quantity.value != "" && price.value != ""){
                let newItem = {
                    'sku':sku.value,
                    'name':name.value,
                    'quantity':quantity.value,
                    'price':price.value
                }

                this.itemsTemp.push(newItem);
                sku.value="";
                name.value="";
                quantity.value="";
                price.value="";
                this.edicionPendiente=2;

                sku.style.border="solid 0px red";
                name.style.border="solid 0px red";
                quantity.style.border="solid 0px red";
                price.style.border="solid 0px red";

            }else{
                if(sku.value == "")
                {
                    sku.style.border="solid 1px red";
                    document.getElementById('err-sku').innerText="Requerido";
                }
                else
                {
                    sku.style.border="solid 0px red";
                    document.getElementById('err-sku').innerText="";
                }

                if(name.value == ""){
                    name.style.border="solid 1px red";
                    document.getElementById('err-name').innerText="Requerido";
                }
                else
                {
                    name.style.border="solid 0px red";
                    document.getElementById('err-name').innerText="";
                }

                if(quantity.value == ""){
                    quantity.style.border="solid 1px red";
                    document.getElementById('err-quantity').innerText="Requerido";
                }
                else
                {
                    quantity.style.border="solid 0px red";
                    document.getElementById('err-quantity').innerText="";
                }

                if(price.value == "")
                {
                    price.style.border="solid 1px red";
                    document.getElementById('err-price').innerText="Requerido";
                }
                else
                {
                    price.style.border="solid 0px red";
                    document.getElementById('err-price').innerText="";
                }
            }
        },
        postListaItems($event){
            this.itemsTemp.forEach(element =>{
                this.Ordenes[this.indexOrdenActiva].items.push(element);
            })
            this.edicionPendiente=1;
            let nt = parseInt(this.Ordenes[this.indexOrdenActiva].totals.total) + this.nuevoTotal;
            this.Ordenes[this.indexOrdenActiva].totals.total=nt;
            this.itemsTemp=[];
            this.nuevoTotal=0;
        },
        procederPago($event,orden){
            if(this.edicionPendiente==2){
                Swal.fire({
                    title: 'Productos sin guardar',
                    text:'Esta orden tiene productos pendientes de agregar, favor de confirmarlos o descartarlos',
                    showClass: {
                      popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                      popup: 'animate__animated animate__fadeOutUp'
                    }
                  })
            }else{
                Swal.fire(
                    '¡Pago realizado!',
                    'La orden No. '+orden.number+' ha sido pagada correctamente',
                    'success'
                  )
                }
            
        }
    }
});

Items.mount('#itemsPedido');