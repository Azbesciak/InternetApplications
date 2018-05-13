<?php
session_start();
$database_name = "product";
$con = mysqli_connect("localhost", "root", "", $database_name, 3306);
function to_main_page()
{
    echo "<script>window.location='Cart.php'</script>";
}

function on_buy_fail($con, $product_name)
{
    echo "<script>alert('could not buy $product_name :(')</script>";
    mysqli_rollback($con);
    to_main_page();
}
if (!isset($_SESSION['wallet'])) {
    $_SESSION['wallet'] = 999999;
}

if (isset($_POST['buy'])) {
    try {
        mysqli_begin_transaction($con);
        $total_price = 0;
        $stmt = mysqli_prepare($con, "UPDATE products SET quantity = quantity - ? where product_id = ?");
        $stmt->bind_param("ii", $quantity, $product_id);
        foreach ($_SESSION["cart"] as $key => $value) {
            $quantity = $value["quantity"];
            $product_id = $value["product_id"];
            if (!$stmt->execute()) {
                on_buy_fail($con, $value['name']);
                return;
            }
            $total_price += $value["quantity"] * $value["price"];
        }
        mysqli_commit($con);
        $_SESSION['cart'] = [];
        $_SESSION['wallet'] -= $total_price;
    } catch (Exception $e) {
        on_buy_fail($con, "");
    }
    to_main_page();
} else if (isset($_POST['add'])) {
    if (!isset($_SESSION['cart'])) {
        $_SESSION['cart'] = [];
    }
    $product_id = $_GET['product_id'];
    $item_array_id = array_column($_SESSION['cart'], 'product_id');
    if (!in_array($product_id, $item_array_id)) {
        $item_array = array(
            'product_id' => $product_id,
            'name' => $_POST['hidden_name'],
            'price' => $_POST['hidden_price'],
            'quantity' => 0
        );
        $_SESSION['cart'][$product_id] = $item_array;
    }
    $_SESSION['cart'][$product_id]['quantity'] += $_POST['quantity'];
    to_main_page();
} else if (isset($_GET["action"])) {
    if ($_GET["action"] == "delete") {
        unset($_SESSION["cart"][$_GET["product_id"]]);
        to_main_page();
    }
}
?>

<!doctype html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

    <title>Shopping Cart</title>
    <style>
        @import url('https://fonts.googleapis.com/css?family=Roboto');

        * {
            font-family: "Roboto", sans-serif;
        }

        .product {
            border: 1px solid #eaeaec;
            margin: -1px 19px 3px -1px;
            padding: 10px;
            text-align: center;
        }

        table, th, tr {
            text-align: center;
        }

        .title2 {
            text-align: center;
            color: #66afe9;
            background-color: #efefef;
            padding: 2%;
        }

        h2 {
            text-align: center;
            color: #66afe9;
            background-color: #efefef;
            padding: 2%;
        }
        h4 {
            text-align: center;
            color: #68cce9;
            background-color: #efefef;
            padding: 1%;
        }
        table th {
            background-color: #efefef;
        }
    </style>
</head>
<body>
<div class="container" style="width: 65%">
    <h2>Shopping Cart</h2>
    <h4>Cash: $ <?php echo number_format($_SESSION["wallet"], 2) ?></h4>
    <div class="row">
        <?php
        $query = "SELECT * FROM products order by product_id asc";
        $result = mysqli_query($con, $query);
        if (mysqli_num_rows($result) > 0) {
            while ($row = mysqli_fetch_array($result)) {
                if ($row['quantity'] <= 0)
                    continue;
                ?>
                <div class="col-md-3">
                    <form method="post" action="Cart.php?action=add&product_id=<?php echo $row["product_id"] ?>">
                        <div class="product">
                            <img src="<?php echo $row["img_url"] ?>" class="img-thumbnail">
                            <h5 class="text-info"><?php echo $row["name"] ?></h5>
                            <h5 class="text-danger">$ <?php echo $row["price"] ?></h5>
                            <input type="number" name="quantity" class="form-control" value="1" min="1"
                                   max="<?php echo $row['quantity'] -
                                       ((isset($_SESSION['cart']) and isset($_SESSION['cart'][$row['product_id']])) ?
                                           $_SESSION['cart'][$row['product_id']]['quantity'] : 0) ?>">
                            <input type="hidden" name="hidden_price" value="<?php echo $row["price"] ?>">
                            <input type="hidden" name="hidden_name" class="form-control"
                                   value="<?php echo $row["name"] ?>">

                            <input type="submit" name="add" style="margin-top: 5px" class="btn btn-success"
                                   value="Add to Cart">
                        </div>
                    </form>
                </div>
                <?php
            }
        }
        ?>
    </div>
    <div style="clear:both"></div>
    <h3 class="title2">Shopping Cart Details</h3>
    <div class="table-responsive">
        <form method="post" action="Cart.php?action=buy">
            <table class="table  table-bordered">
                <tr>
                    <th width="30%">Product Name</th>
                    <th width="10%">Quantity</th>
                    <th width="13%">Price Details</th>
                    <th width="10%">Total Price</th>
                    <th width="17%">Remove Item</th>
                </tr>

                <?php
                if (!empty($_SESSION["cart"])) {
                    $total = 0;
                    foreach ($_SESSION["cart"] as $key => $value) {
                        ?>
                        <tr>
                            <td><?php echo $value["name"] ?></td>
                            <td><?php echo $value["quantity"] ?></td>
                            <td>$ <?php echo $value["price"] ?></td>
                            <td>$ <?php echo number_format($value["quantity"] * $value["price"], 2) ?></td>
                            <td>
                                <a href="Cart.php?action=delete&product_id=<?php echo $value["product_id"] ?>">
                                    <span class="text-danger">Remove Item</span>
                                </a>
                            </td>
                        </tr>
                        <?php
                        $total += $value["quantity"] * $value["price"];
                    }
                    ?>
                    <tr>
                        <td colspan="3" align="right">Total</td>
                        <th align="right">$ <?php echo number_format($total, 2) ?></th>
                        <td>
                            <input type="submit" name="buy" style="margin-top: 5px"
                                   class="btn btn-success" value="Buy">
                        </td>
                    </tr>
                    <?php
                }
                ?>
            </table>
        </form>
    </div>

</div>


<!-- Optional JavaScript -->
<!-- jQuery first, then Popper.js, then Bootstrap JS -->
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
        integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
        crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
        integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
        crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
        integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
        crossorigin="anonymous"></script>
</body>
</html>