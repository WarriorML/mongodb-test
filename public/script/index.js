function goAddUser(){
    location.href = 'add.html'
}

function removeUser(id){
    $.post({
        url:'/api/v1/remove/'+id,
        data:null,
        success:function(res){
            if (res.code == 'success') {
                location.reload()
            }else{
                alert('删除失败')
            }
        }
    })
}