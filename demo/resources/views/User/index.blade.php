<html>
  <head>
   <title>User crud</title>  
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet"> 
  </head>
<body>
<div class="container">
<div class="panel panel-primary">
 <div class="panel-heading">User CRUD
 <button id="btn_add" name="btn_add" class="btn btn-default pull-right">Add New</button>
    </div>
      <div class="panel-body"> 
       <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
         </thead>
         <tbody id="products-list" name="products-list">
           @foreach ($users as $user)
            <tr id="product{{$user->id}}">
             <td>{{$user->id}}</td>
             <td>{{$user->name}}</td>
             <td>{{$user->email}}</td>
             @foreach($roles as $role)
             @if($role->id == $user->role_id)
                <td>{{$role->name}}</td>
             @endif
             @endforeach
             

              <td>
              <button class="btn btn-warning btn-detail open_modal" value="{{$user->id}}">Edit</button>
              <button class="btn btn-danger btn-delete delete-product" value="{{$user->id}}">Delete</button>
              </td>
            </tr>
            @endforeach
        </tbody>
        </table>
       </div>
       </div>
       <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                <h4 class="modal-title" id="myModalLabel">user</h4>
            </div>
            <div class="modal-body">
                <form id="frmProducts"  class="form-horizontal" enctype="multipart/form-data" >
                    <div class="form-group error">
                        <label for="inputName" class="col-sm-3 control-label">Name</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control has-error" id="name" name="name" placeholder=" Name" value="">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="inputEmail" class="col-sm-3 control-label">Email</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="email" name="email" placeholder="Email" value="">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="inputPhone" class="col-sm-3 control-label">Phone</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="phone" name="phone" placeholder="Phone" value="">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="inputDetail" class="col-sm-3 control-label">Description</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="description" name="description" placeholder="Description" value="">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="inputRoleId" class="col-sm-3 control-label">Role </label>
                        <div class="col-sm-9">
                        <select class="form-control" id="role_id" name="role_id">
                            @foreach($roles as $role)
                            <option value="{{$role->id}}">{{$role->name}}</option>
                            @endforeach
                        </select>
                    </div>
                    </div>
                    <div class="form-group">
                        <label for="inputProfileImage" class="col-sm-3 control-label">Profile Image</label>
                        <div class="col-sm-9">
                            <input type="file" class="form-control" id="profile_image" name="profile_image" >
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="btn-save" value="add">Save changes</button>
                <input type="hidden" id="product_id" name="product_id" value="0">
            </div>
        </div>
    </div>
</div>

    <meta name="_token" content="{!! csrf_token() !!}" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <script src="{{asset('js/ajaxscript.js')}}"></script>
    <script>
         $('#btn_add').click(function(){
        $('#btn-save').val("add");
        $('#frmProducts').trigger("reset");
        $('#myModal').modal('show');
    });
    $("#btn-save").click(function (e) {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        })
        e.preventDefault(); 
        
        var formData = {
                name: $('#name').val(),
                email: $('#email').val(),
                phone: $('#phone').val(),
                description: $('#description').val(),
                role_id: $('#role_id').val(),
                profile_image: $('#profile_image').val()
};
       
        var state = $('#btn-save').val();
        var type = "POST"; 
        var user_id = $('#product_id').val();;
       
        if (state == "update"){
            type = "PUT"; 
            var my_url = "{{ route('home.update', ['home' => ':user_id']) }}".replace(':user_id', user_id);
        }else{
            var my_url = "{{ route('home.store') }}";
        }
        console.log(formData);
        $.ajax({
            type: type,
            url: my_url,

            data: formData,
            dataType: 'json',
            success: function (data) {
                console.log(data);
                var product = '<tr id="product' + data.id + '"><td>' + data.id + '</td><td>' + data.name + '</td><td>' + data.email + '</td><td>' + data.role_name.name + '</td>';
                product += '<td><button class="btn btn-warning btn-detail open_modal" value="' + data.id + '">Edit</button>';
                product += ' <button class="btn btn-danger btn-delete delete-product" value="' + data.id + '">Delete</button></td></tr>';
                if (state == "add"){ 
                    $('#products-list').append(product);
                }else{ 
                    $("#product" + user_id).replaceWith( product );
                }
                $('#frmProducts').trigger("reset");
                $('#myModal').modal('hide')
            },
            error: function (xhr) {
                var errors = xhr.responseJSON.errors;
                $.each(errors, function (key, value) {
                   
                    var inputField = $('#' + key);
                    inputField.closest('.form-group').addClass('has-error');
                    inputField.after('<span class="help-block">' + value[0] + '</span>');
                });
            }
        });
    });

    $(document).on('click','.open_modal',function(){
        var user_id = $(this).val();
       
        $.get("{{ route('home.show', ['home' => ':user_id']) }}".replace(':user_id', user_id), function (data) {
    // success data
    console.log(data);
    $('#product_id').val(data.id);
    $('#name').val(data.name);
    $('#description').val(data.description);
    $('#email').val(data.email);  
    $('#phone').val(data.phone);  
    $('#role_id').val(data.role_id); 
   

    $('#btn-save').val("update");
    $('#myModal').modal('show');
})
.fail(function (xhr) {
    
    console.log('Error:', xhr);
});
    });

    $(document).on('click','.delete-product',function(){
        var user_id = $(this).val();
         $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        })
        $.ajax({
            type: "DELETE",
            url: "{{ route('home.destroy', ['home' => ':user_id']) }}".replace(':user_id', user_id),
            success: function (data) {
                console.log(data);
                $("#product" + user_id).remove();
            },
            error: function (data) {
                console.log('Error:', data);
            }
        });
    });
        </script>
</body>
</html>