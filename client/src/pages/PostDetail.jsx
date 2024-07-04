import React from "react";
import PostAuthor from "../components/PostAuthor";
import { Link } from "react-router-dom";
import Thumbnail from "../assets/thumbnail.jpg";

const PostDetail = () => {
  return (
    <section className="post-detail">
      <div className="container post-detail__container">
        <div className="post-detail__header">
          <PostAuthor />
          <div className="post-detail__buttons">
            <Link to={`/posts/werwer/edit`} className="btn sm primary">
              Edit
            </Link>
            <Link to={`/posts/werwer/delete`} className="btn sm danger">
              Delete
            </Link>
          </div>
        </div>
        <h1>This is the post title</h1>
        <div className="post-detail__thumbnail">
          <img src={Thumbnail} alt="" />
        </div>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Explicabo
          aliquam aliquid repellat eaque dolor assumenda debitis iste rerum quis
          atque. Officia, beatae esse. Cum reiciendis, sit dolore incidunt amet
          at soluta aperiam vero perferendis laboriosam veniam fugit officia
          saepe explicabo.
        </p>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque animi
          quis porro delectus, autem repellat iste ullam obcaecati recusandae?
          Asperiores ea laboriosam quisquam vero tenetur maiores illum quas
          voluptatem fugiat minus dolores provident assumenda quos dolor nam
          dicta debitis veniam, sapiente aut eligendi nulla aspernatur eos. Sunt
          ipsam a vel voluptates ipsum! Ipsam, nam? Quod.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate qui
          fuga voluptates accusantium placeat soluta in, nulla natus veniam.
          Minus totam pariatur atque. Consectetur ipsam recusandae minus vel?
          Officiis veniam iste quibusdam, dolorum error, nulla officia, expedita
          architecto ut dolor nam voluptate inventore. Illo odio obcaecati
          accusamus dolorem porro exercitationem aspernatur doloremque non
          deleniti rem eius eos alias, nemo voluptate velit debitis consectetur
          praesentium quam amet facilis molestias sequi voluptatibus? Dolor
          molestias voluptatem cum sit soluta culpa. Obcaecati explicabo eveniet
          tempora sint cumque quas quia reiciendis saepe amet minima odit
          possimus consectetur temporibus enim delectus laboriosam libero
          molestiae id sed, vel nisi, quidem sit, quibusdam ipsa. Asperiores
          libero eos ut temporibus.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde,
          nesciunt id et neque beatae, porro quisquam veritatis aperiam iste ea,
          soluta sit adipisci! Aperiam illo nulla nesciunt tempore tempora?
          Quibusdam?
        </p>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae,
          beatae. Et, dolores repudiandae! Recusandae eveniet, tempore, dolores
          incidunt necessitatibus earum natus amet eaque nam illum iusto porro
          est voluptatum rem itaque. Ipsam ducimus doloremque incidunt explicabo
          distinctio veniam odit eveniet, asperiores maxime iste fugit iusto
          voluptatibus similique rerum inventore, exercitationem at. Sed dolore,
          temporibus provident impedit quae possimus error fuga sapiente officia
          quod quos hic sunt, architecto at molestiae dolorem velit voluptatibus
          iure. Dolorum at hic accusamus ducimus modi omnis mollitia
          voluptatibus. Dicta temporibus consectetur facilis libero alias nisi
          dolor. Consequuntur explicabo incidunt, velit earum fugit dignissimos
          qui est optio ex repudiandae dolorem architecto, culpa officia
          ratione! Doloremque blanditiis at perspiciatis eius asperiores,
          temporibus dignissimos sed voluptate adipisci cum quod facere
          provident. Nisi recusandae natus facere voluptatum incidunt libero,
          corrupti eos error beatae explicabo reprehenderit soluta vel eaque
          officiis exercitationem quo mollitia, qui molestiae ad earum harum.
          Pariatur, voluptate maiores laborum vel temporibus soluta atque neque
          sit incidunt quasi qui voluptates! Perferendis assumenda similique
          architecto voluptatum dolorem dolor, dignissimos tenetur aliquid
          temporibus, ratione est veritatis possimus nobis deserunt sunt illo
          eaque! Maiores aperiam molestiae pariatur, corporis est unde dolores
          aut nesciunt quae, molestias praesentium possimus modi rem id. Alias,
          nemo?
        </p>
      </div>
    </section>
  );
};

export default PostDetail;
