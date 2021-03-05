$(function() {
    // 获取文章分类的列表
    initArtCateList()

    // 1.获取文章分类的列表方法
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        });
    }

    // 2. 在按钮的点击事件中，通过 `layer.open()` 展示弹出层：
    var layer = layui.layer;
    // 为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });

    //3. 实现添加文章分类的功能
    // 通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！');
                }
                // 重新加载表格数据
                initArtCateList();
                layer.msg('新增分类成功！');
                // 根据索引关闭弹出框
                layer.close(indexAdd);
            }
        });
    });

    // 4. 实现编辑文章分类的功能
    // 通过 `代理` 的形式，为 `btn-edit` 按钮绑定点击事件：
    var indexEdit = null
    var form = layui.form;
    $('tbody').on('click', '.btn-edit', function() {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        // 为修改文章分类的弹出层填充表单数据
        // 在展示弹出层之后，根据 id 的值发起请求获取文章分类的数据，并填充到表单中：
        var id = $(this).attr('data-id');
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data)
            }
        });

    });

    // 点击确认 ，更新文章分类的数据
    // 通过代理的形式，为修改分类的表单绑定 submit 事件：
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！');
                layer.close(indexEdit);
                // 重新加载表格数据
                initArtCateList();
            }
        });

    });

    // 删除文章分类
    // 为删除按钮绑定 `btn-delete` 类名，并添加 `data-id` 自定义属性
    // 通过代理的形式，为删除按钮绑定点击事件：
    $('body').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        // 提示用户是否要删除
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！');
                    }
                    layer.msg('删除分类成功！');
                    layer.close(index);
                    initArtCateList()
                }
            });
        })
    });






});