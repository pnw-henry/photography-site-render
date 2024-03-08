class CreatePhotographs < ActiveRecord::Migration[7.1]
  def change
    create_table :photographs do |t|
      t.string :description

      t.timestamps
    end
  end
end
