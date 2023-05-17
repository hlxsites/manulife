## Tiles block

Tiles block render a list of tiles in different combination, and make complete tile clickable. 

### Tiles block authoring
The tiles block should be configured in 4 column table:

| Column    | Required     | Description                |
| :-------- | :----------- | :------------------------- |
| Image     | **Optional** | Image to be rendered on tile. Image size should be minimum 600px |
| Body      | **Optional** | The text to be displayed on the bottom side of image. Body can has icons also, see the icon section |
| Link      | **Required** | Tile link                  |
| BG Color  | **Required** | Tile background color      |


### Background color list
Content authors can use the following pattern to define background color code.
```css
!bgcolor:<color name>!

eg.
!bgcolor:orange!
```

Use the following codes
| Color     | Hex Code     | Configuration code         |
| :-------- | :----------- | :------------------------- |
| Orange    | #E1A500      | !bgcolor:orange!           |
| Green     | #008000      | !bgcolor:green!            |
| Red       | #FF0000      | !bgcolor:red!              |
| Blue      | #0000FF      | !bgcolor:blue!             |
| Jade      | #00A758      | !bgcolor:jade!             |
| Cyan      | #07857D      | !bgcolor:cyan!             |
| White     | #FFFFFF      | !bgcolor:white!            |

### Using icons in body
Helix standard icon pattern will be used to render the icon. 
```
:officebuilding: 
```

Following icons are currently supported
| Icon code       | 
| :-------------- | 
| userlogin       |
| award           |
| officebuilding  |
| advisor         |